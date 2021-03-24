import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
    selector: 'app-user-create',
    templateUrl: './user-create.component.html',
    styleUrls: ['./user-create.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger(
            'inOutAnimation',
            [
                transition(
                    ':enter',
                    [
                        style({ height: 0, opacity: 0 }),
                        animate('1s ease-out',
                            style({ height: 300, opacity: 1 }))
                    ]
                ),
                transition(
                    ':leave',
                    [
                        animate('1s ease-out',
                            style({ height: 0, opacity: 0 }))
                    ]
                )
            ]
        )
    ]
})

export class UserCreateComponent implements OnInit {

    modalRef: BsModalRef;
    entryForm: FormGroup;
    designationForm: FormGroup;
    sectionForm: FormGroup;
    submitted = false;
    sectionSubmitted = false;
    designationSubmitted = false;
    @BlockUI() blockUI: NgBlockUI;
    formTitle = 'BP User Entry';
    btnSaveText = 'Save';
    id: string;
    isEdit: boolean = false;
    supplier_submitted = false;
    modalTitle = 'Add Designation';
    sectionModalTitle = 'Add Section';

    modalConfig: any = { class: 'gray', backdrop: 'static' };
    modalLgConfig: any = { class: 'gray modal-xl', backdrop: 'static' };

    sectionDropDownList: Array<any> = [];
    designationDropDownList: Array<any> = [];
    inventoryStoreDropDownList: Array<any> = [];
    userRoleList: Array<any> = [];
    permissionList: Array<any> = [];

    constructor(
        private modalService: BsModalService,
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private toastr: ToastrService,
        private _location: Location,
        private route: ActivatedRoute
    ) {
        if (this.route.snapshot.paramMap.has("id")) {
            this.id = this.route.snapshot.paramMap.get("id");
            this.isEdit = true;
        }
    }


    ngOnInit() {
        this.entryForm = this.formBuilder.group({
            id: [null],
            first_name: [null, [Validators.required, Validators.maxLength(250)]],
            last_name: [null, [Validators.required, Validators.maxLength(250)]],
            bp_id: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
            email: [null, [Validators.required, Validators.maxLength(250)]],
            present_address: [null, [Validators.maxLength(1000)]],
            permanent_address: [null, [Validators.maxLength(1000)]],
            mobile: [null, [Validators.maxLength(250)]],
            extension_no: [null, [Validators.maxLength(250)]],
            userRoleId: [null, [Validators.required]],
            designation: [null, [Validators.required]],
            department: [null],
            StoreId: [null],
            posting_area: [null, [Validators.maxLength(250)]],
            transferred: [false],
            is_active: [true]
        });

        this.designationForm = this.formBuilder.group({
            Id: [null],
            Name: [null, [Validators.required, Validators.maxLength(250)]],
            Description: [null, [Validators.maxLength(500)]],
            IsActive: [true]

        });

        this.sectionForm = this.formBuilder.group({
            Id: [null],
            Name: [null, [Validators.required, Validators.maxLength(250)]],
            Description: [null, [Validators.maxLength(500)]],
            IsActive: [true]

        });

        this.getSectionDropdownList();
        this.getDesignationDropdownList();
        this.getUserRoleList();
        this.getPermisstionList();
        this.getInventoryStoreList();
    }

    get f() {
        return this.entryForm.controls;
    }

    get df() {
        return this.designationForm.controls;
    }

    openDesignationModal(template: TemplateRef<any>) {
        this.designationForm.controls['IsActive'].setValue(true);
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    get sf() {
        return this.sectionForm.controls;
    }

    openSectionModal(template: TemplateRef<any>) {
        this.sectionForm.controls['IsActive'].setValue(true);
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    getInventoryStoreList() {
        this._service.get('inventory-store/dropdown-list').subscribe(res => {
            this.inventoryStoreDropDownList = res.Records;
        }, () => { }
        );
    }

    getSectionDropdownList() {
        this._service.get('section/dropdown-list').subscribe(res => {
            this.sectionDropDownList = res.Records;
        }, () => { }
        );
    }

    getDesignationDropdownList() {
        this._service.get('designation/dropdown-list').subscribe(res => {
            this.designationDropDownList = res.Records;
        }, () => { }
        );
    }

    getUserRoleList() {
        this._service.get('user-role/dropdown-list').subscribe(res => {
            this.userRoleList = res.Records;
        }, () => { }
        );
    }

    onChangeUserRole(event) {
        console.log(event);
        this.blockUI.start('Getting data. Please wait ...');
        this._service.get('user-role/' + event.Id + '/permissions').subscribe(res => {
            this.blockUI.stop();
            if (!res.Success) {
                this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
                return;
            }
            this.permissionList.forEach(element => {
                element.IsSelected = res.Records.indexOf(element.Id) !== -1;
            });
        }, err => {
            this.blockUI.stop();
            this.toastr.error(err.Message || err, 'Error!', { timeOut: 2000 });
        }
        );
    }

    getPermisstionList() {
        this.blockUI.start('Getting data. Please wait ...');
        this._service.get('user-role/permission/list').subscribe(res => {
            if (!res.Success) {
                this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
                return;
            }
            this.permissionList = [];
            res.Records.forEach(element => {
                this.permissionList.push({
                    Id: element.Id,
                    Name: element.Name,
                    IsSelected: false
                })
            });
            if (this.id)
                this.getItem(this.id);
            this.blockUI.stop();
        }, err => {
            this.blockUI.stop();
            this.toastr.error(err.Message || err, 'Error!', { timeOut: 2000 });
        }
        );
    }

    getItem(id) {
        this.blockUI.start('Getting data...');
        this._service.get('bp-user/get/' + id).subscribe(res => {
            this.blockUI.stop();
            if (!res.Success) {
                this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: false });
                return;
            }
            this.formTitle = 'Update BP User';
            this.btnSaveText = 'Update';
            this.entryForm.controls['id'].setValue(res.Record.BPUser.Id);
            this.entryForm.controls['first_name'].setValue(res.Record.BPUser.FirstName);
            this.entryForm.controls['last_name'].setValue(res.Record.BPUser.LastName);
            this.entryForm.controls['bp_id'].setValue(res.Record.BPUser.BPID);
            this.entryForm.controls['email'].setValue(res.Record.BPUser.Email);
            this.entryForm.controls['present_address'].setValue(res.Record.BPUser.PresentAddress);
            this.entryForm.controls['permanent_address'].setValue(res.Record.BPUser.PermanentAddress);
            this.entryForm.controls['mobile'].setValue(res.Record.BPUser.PhoneNo);
            this.entryForm.controls['extension_no'].setValue(res.Record.BPUser.InterComNo);
            this.entryForm.controls['designation'].setValue(res.Record.BPUser.DesignationId);
            this.entryForm.controls['department'].setValue(res.Record.BPUser.SectionId);
            this.entryForm.controls['posting_area'].setValue(res.Record.BPUser.PostingArea);
            this.entryForm.controls['transferred'].setValue(res.Record.BPUser.Transferred);
            this.entryForm.controls['userRoleId'].setValue(res.Record.BPUser.RoleGroupId);
            this.entryForm.controls['StoreId'].setValue(res.Record.BPUser.StoreId);
            this.entryForm.controls['bp_id'].disable();
            this.permissionList.forEach(element => {
                element.IsSelected = res.Record.Roles.indexOf(element.Id) !== -1;
            });

        }, err => {
            this.blockUI.stop();
            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: false });
        });
    }

    onSectionFormSubmit() {
        this.sectionSubmitted = true;
        if (this.sectionForm.invalid) {
            return;
        }

        this.blockUI.start('Saving...');

        const obj = {
            Id: this.sectionForm.value.Id ? this.sectionForm.value.Id : 0,
            Name: this.sectionForm.value.Name.trim(),
            Description: this.sectionForm.value.Description ? this.sectionForm.value.Description.trim() : this.sectionForm.value.Description,
            IsActive: this.sectionForm.value.IsActive
        };

        const request = this._service.post('section/create-or-update', obj);

        request.subscribe(
            data => {
                this.blockUI.stop();
                if (data.Success) {
                    this.toastr.success(data.Message, 'Success!', { timeOut: 2000 });
                    this.getSectionDropdownList();
                    this.modalHide();
                    this.entryForm.controls['department'].setValue(data.Id);
                } else {
                    this.toastr.error(data.Message, 'Error!', { closeButton: true, disableTimeOut: false });
                }
            },
            err => {
                this.blockUI.stop();
                this.toastr.error(err.Message || err, 'Error!', { closeButton: true, disableTimeOut: false });
            }
        );
    }

    onDesignationFormSubmit() {
        this.designationSubmitted = true;
        if (this.designationForm.invalid) {
            return;
        }

        const obj = {
            Id: this.designationForm.value.Id ? this.designationForm.value.Id : 0,
            Name: this.designationForm.value.Name.trim(),
            Description: this.designationForm.value.Description ? this.designationForm.value.Description.trim() : this.designationForm.value.Description,
            IsActive: this.designationForm.value.IsActive
        };

        const request = this._service.post('designation/create-or-update', obj);

        request.subscribe(
            data => {
                this.blockUI.stop();
                if (data.Success) {
                    this.toastr.success(data.Message, 'Success!', { timeOut: 2000 });
                    this.getDesignationDropdownList();
                    this.modalHide();
                    this.entryForm.controls['designation'].setValue(data.Id);
                } else {
                    this.toastr.error(data.Message, 'Error!', { closeButton: true, disableTimeOut: false });
                }
            },
            err => {
                this.blockUI.stop();
                this.toastr.error(err.Message || err, 'Error!', { closeButton: true, disableTimeOut: false });
            }
        );
    }

    onFormSubmit() {
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }
        
        this.entryForm.controls['bp_id'].enable();

        this.blockUI.start('Saving...');
        const obj = {
            Id: this.entryForm.value.id ? this.entryForm.value.id : 0,
            FirstName: this.entryForm.value.first_name.trim(),
            LastName: this.entryForm.value.last_name.trim(),
            BPID: this.entryForm.value.bp_id,
            Email: this.entryForm.value.email ? this.entryForm.value.email.trim().toLowerCase() : this.entryForm.value.email,
            PresentAddress: this.entryForm.value.present_address ? this.entryForm.value.present_address.trim() : this.entryForm.value.present_address,
            PermanentAddress: this.entryForm.value.permanent_address ? this.entryForm.value.permanent_address.trim() : this.entryForm.value.permanent_address,
            PhoneNo: this.entryForm.value.mobile ? this.entryForm.value.mobile.trim() : this.entryForm.value.mobile,
            InterComNo: this.entryForm.value.extension_no ? this.entryForm.value.extension_no.trim() : this.entryForm.value.extension_no,
            DesignationId: this.entryForm.value.designation,
            SectionId: this.entryForm.value.department,
            StoreId: this.entryForm.value.StoreId,
            PostingArea: this.entryForm.value.posting_area ? this.entryForm.value.posting_area.trim() : this.entryForm.value.posting_area,
            Transferred: this.entryForm.value.transferred,
            RoleGroupId: this.entryForm.value.userRoleId,
            Roles: this.permissionList.filter(x => x.IsSelected === true).map(x => x.Id)
        };

        const request = this._service.post('bp-user/create-or-update', obj);

        request.subscribe(
            data => {
                this.blockUI.stop();
                if (data.Success) {
                    this.toastr.success(data.Message, 'Success!', { timeOut: 2000 });
                    this._location.back();
                } else {
                    this.toastr.error(data.Message, 'Error!', { closeButton: true, disableTimeOut: false });
                }
            },
            err => {
                this.blockUI.stop();
                this.toastr.error(err.Message || err, 'Error!', { closeButton: true, disableTimeOut: false });
            }
        );

    }

    modalHide() {
        this.designationForm.reset();
        this.sectionForm.reset();
        this.modalRef.hide();
        this.sectionSubmitted = false;
        this.designationSubmitted = false;
        this.modalTitle = 'Add Designation';
        this.sectionModalTitle = 'Add Section';
        this.btnSaveText = 'Save';
    }

}
