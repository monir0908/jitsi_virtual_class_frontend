import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import * as moment from 'moment';
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class PaymentComponent implements OnInit {

    entryForm: FormGroup;
    submitted = false;
    @BlockUI() blockUI: NgBlockUI;
    modalTitle = 'Make Payment';
    btnSaveText = 'Pay';
    searchFrom: FormGroup;
    paymentForm: FormGroup;

    expanded: any = {};
    @ViewChild('dataTable', { static: false }) table: any;

    modalConfig: any = { class: 'gray modal-xl', backdrop: 'static' };
    modalRef: BsModalRef;

    page = new Page();

    temp = [];
    rows = [];
    userList = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;


    allocationID = null;
    allocationDetails = null;

    bookingRooms = [];
    checkRooms = []

    subTotal: number = 0;
    discount: number = 0;
    paidAmount: number = 0;
    paybleAmount: number  = 0;
    previousDiscount: number = 0;
    previousPaidAmount: number = 0;

    scrollBarHorizontal = (window.innerWidth < 1200);

    constructor(
        private modalService: BsModalService,
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private toastr: ToastrService,
        private confirmService: ConfirmService,
        private router: Router
    ) {
        this.page.pageNumber = 0;
        this.page.size = 10;
        window.onresize = () => {
            this.scrollBarHorizontal = (window.innerWidth < 1200);
        };
    }

    get f() {
        return this.searchFrom.controls;
    }


    ngOnInit() {
        this.searchFrom = this.formBuilder.group({
            Id: [null],
            visitorId: [null]
        });
        this.getUserList();
        //this.getList();
    }



    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getList();
    }

    getUserList() {
        this.userList = [];
        this._service.get('visitor/dropdown-list').subscribe(res => {
            this.userList = res.Records;
        }, err => { }
        );
    }

    getList() {
        this.loadingIndicator = true;
        const obj = {
            size: this.page.size,
            pageNumber: this.page.pageNumber
        };
        this._service.get('allocation/list', obj).subscribe(res => {
            console.log(res);
            if (!res.Success) {
                this.toastr.error(res.Message, 'Error!', {
                    closeButton: true,
                    disableTimeOut: true
                });
                return;
            }
            this.rows = res.Records;
            this.temp = res.Records;
            setTimeout(() => {
                this.loadingIndicator = false;
            }, 1000);
        }, err => {
            this.toastr.error(err.message || err, 'Error!', {
                closeButton: true,
                disableTimeOut: true
            });
            setTimeout(() => {
                this.loadingIndicator = false;
            }, 1000);
        });
    }

    addRemoveRoom(room) {
        if (this.checkRooms.indexOf(room.RoomId) == -1) {
            this.checkRooms.push(room.RoomId);
        } else {
            this.checkRooms.splice(this.checkRooms.indexOf(room.RoomId), 1);
        }
    }

    searchAllocation(){
        this.loadingIndicator = true;
        if(this.searchFrom.value.visitorId){
            this._service.get('allocation/unpaid-list/' + this.searchFrom.value.visitorId).subscribe(res => {
                if (!res.Success) {
                    this.toastr.error(res.Message, 'Error!', {
                        closeButton: true,
                        disableTimeOut: true
                    });
                    return;
                }
                this.rows = res.Records;
                this.temp = res.Records;
                setTimeout(() => {
                    this.loadingIndicator = false;
                }, 1000);
            }, err => {
                this.toastr.error(err.Message || err, 'Error!', {
                    closeButton: true,
                    disableTimeOut: true
                });
                setTimeout(() => {
                    this.loadingIndicator = false;
                }, 1000);
            });
        }else{
            this.toastr.warning('Please, select User!', '', { closeButton: true, disableTimeOut: true });
        }
    }

    getBookingRooms(item, template) {
        this.allocationID = item.Id;
        this.allocationDetails = item;
        this.subTotal = item.SubTotal;
        this.discount = 0;
        this.paidAmount = 0;
        this.paybleAmount = item.SubTotal;
        this.previousDiscount = item.Discount;
        this.previousPaidAmount = item.Paid;

        this.checkRooms = [];
        this._service.get('allocation/details/' + this.allocationID).subscribe(res => {
            this.bookingRooms = res.Record;
            this.bookingRooms.forEach((value, key) => {
                if(!value.CheckIn)
                    this.checkRooms.push(value.RoomId);
            });
            this.modalRef = this.modalService.show(template, this.modalConfig);
        }, err => { });
    }

    rejectReq(item) {

        this.confirmService.confirm('Are you sure?', 'You are reject this booking.')
            .subscribe(
                result => {
                    if (result) {
                        this.blockUI.start('Rejecting...');
                        const obj = {
                            id: item.id,
                            status: 'Rejected'
                        }
                        this._service.post('bookings/update-status', obj).subscribe(res => {
                            this.blockUI.stop();
                            if (!res.success) {
                                this.toastr.error(res.message, 'Error!', { timeOut: 2000 });
                                return;
                            }
                            this.getList();
                            this.toastr.success(res.message, 'Success!', { timeOut: 2000 });

                        }, err => {
                            this.blockUI.stop();
                            this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
                        });


                    }
                },

            );

    }

    makePayment(){
        if(this.paidAmount){
            const payParam = {
                VisitorId: this.searchFrom.value.visitorId,
                AllocationId: this.allocationID,
                PaidAmount: Number(this.paidAmount),
                Discount: Number(this.discount)
            }
            
            const request = this._service.post('payment/create', payParam);

            request.subscribe(
                data => {
                    this.blockUI.stop();
                    if (data.Success) {
                        this.toastr.success('Payment Successful', 'Success!', { timeOut: 2000 });
                        this.searchAllocation();
                        this.modalHide();
                        this.resetForm();
                    } else {
                        this.toastr.error(data.Message, 'Error!', { closeButton: true, disableTimeOut: true });
                    }
                },
                err => {
                    this.blockUI.stop();
                    this.toastr.error(err.Message || err, 'Error!', { closeButton: true, disableTimeOut: true });
                }
            );
        }else{
            this.toastr.warning('Please, Enter pay amount!', '', { closeButton: true, disableTimeOut: true });
        }
    }

    updateFilter(event) {
        const val = event.target.value.toLowerCase();

        // filter our data
        const temp = this.temp.filter(function (d) {
            return d.bp_user_id.full_name.toLowerCase().indexOf(val) !== -1 ||
                d.room_id.name.toLowerCase().indexOf(val) !== -1 ||
                !val;
        });

        // update the rows
        this.rows = temp;
        // Whenever the filter changes, always go back to the first page
        this.table.offset = 0;
    }

    modalHide() {
        //this.userFrom.reset();
        this.modalRef.hide();
        this.submitted = false;
        this.modalTitle = 'Make Payment';
        this.btnSaveText = 'Pay';
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    toggleExpandRow(row) {
        if (!row.details) {
            this.allocationDetails = row;
            this._service.get('allocation/details/' + row.Id).subscribe(res => {
            if (!res.Success) {
                this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
                return;
            }
            row.details = res.Record;
            this.table.rowDetail.toggleExpandRow(row);
            });
        } else
            this.table.rowDetail.toggleExpandRow(row);
    }

    getDateTimeFormat(value:Date){
        return moment(value).format('DD-MMM-YYYY hh:mm A');
    }

    onChangeDiscount(value) {
        if (parseFloat(value) > this.paybleAmount) {
            this.discount = this.paybleAmount;
        }
    }

    onChangePaid(value) {
        if (parseFloat(value) > this.paybleAmount - this.discount) {
            this.paidAmount = this.paybleAmount - this.discount;
        }
    }

    resetForm(){
        this.subTotal = 0;
        this.discount = 0;
        this.paidAmount = 0;
        this.paybleAmount = 0;
        this.previousDiscount = 0;
        this.previousPaidAmount = 0;
    }


}
