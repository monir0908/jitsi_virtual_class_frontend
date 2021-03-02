import { Component, TemplateRef, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AuthenticationService } from './../_services/authentication.service';
import { CommonService } from './../_services/common.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as moment from 'moment';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { env } from 'process';


import {ElementRef} from '@angular/core';

// JISTI RELATED
import './../../assets/data/external_api.js';

declare var JitsiMeetExternalAPI: any;


HC_exporting(Highcharts);

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class HomeComponent implements OnInit {

    public studentList : Array<any> = []
    public HostList : Array<any> = []

    

    public currentUser: any;
    public allContent: any;
    public buildingWiseRooms: any;
    public allocationRoomDetails: any;
    public floorRooms: any;
    submitted = false;
    bsConfig: Partial<BsDatepickerConfig>;

    searchForm: FormGroup;

    modalConfig: any = { class: 'gray modal-xl', backdrop: 'static' };
    modalRef: BsModalRef;
    
    ColumnMode = ColumnMode;
    


    modalTitle = 'Allocation Details';
    btnSaveText = 'Close';

    imgBaseUrl = environment.baseUrl;

    getMonthlyPayment = [];
    courseOptions: any = null;
    highcharts = Highcharts;
    @BlockUI() blockUI: NgBlockUI;
    printableCollections = 0;

    // JISTI RELATED
    apiObj = null;
    domain = 'live-class.joogle.xyz';   
    options;
    @ViewChild('jitsi') el:ElementRef;





    constructor(
        private authService: AuthenticationService,
        private modalService: BsModalService,
        private toastr: ToastrService,
        private router: Router,
        public formBuilder: FormBuilder,
        private _service: CommonService
    ) {
        this.currentUser = this.authService.currentUserDetails.value;
    }

    ngOnInit() {
        this.searchForm = this.formBuilder.group({
            Date: [new Date()],
        });

        this.bsConfig = {
            minDate: new Date()
        }

        this.getMyStudentList(this.currentUser.Id);
        this.getMyHostList(this.currentUser.Id);
        
    }

    get f() {
        return this.searchForm.controls;
    }


    
    // JISTI RELATED
    joinConference(obj){
        this.el.nativeElement.focus();

        this.options = {
            roomName: obj.RoomId,
            width: '100%',
            height: '800px',
            parentNode: this.el.nativeElement,
            userInfo: {
                displayName: this.currentUser.FirstName
            },
            
        
        };
        this.apiObj = new JitsiMeetExternalAPI(this.domain, this.options);
        this.apiObj.addEventListeners({
            readyToClose: function () {
                
                console.log("hello");
                // this.jitsiElement.nativeElement.remove();
            },
            participantJoined: function(data){
                console.log('participantJoined', data);
                
                alert(data.displayName + " has joined and id is '" + data.id + "'")
            },
            participantLeft: function(data){
                console.log('participantLeft', data);
            }
        });
    }


    btnHangup(){
        this.apiObj.executeCommand('hangup');
    }
    

    getMyStudentList(userId){
        this._service.get('api/conference/GetParticipantListByHostId/' + userId ).subscribe(res => {
            this.studentList = res.Records;
            console.log(this.studentList)
        }, err => { }
        );

    }

    getMyHostList(userId){
        this._service.get('api/conference/GetHostListByParticipantId/' + userId ).subscribe(res => {
            this.HostList = res.Records;
            console.log(this.HostList)
        }, err => { }
        );

    }

    startConference(obj){

        console.log(obj)

        const confObj = {
            HostId: obj.HostId,
            ParticipantId: obj.ParticipantId,
            BatchId: obj.BatchId
        }

        console.log(confObj);

        this._service.post('/api/conference/CreateConference', confObj).subscribe(data => {
            this.blockUI.stop();
            if (data.Success) {
                this.toastr.success(data.Message, 'Success!', { timeOut: 2000 });
                this.getMyStudentList(this.currentUser.Id);
            } else {
                this.toastr.error(data.Message, 'Error!', { closeButton: true, disableTimeOut: true });
            }
        },
        err => {
            this.blockUI.stop();
            this.toastr.error(err.Message || err, 'Error!', { closeButton: true, disableTimeOut: true });
        }
        );
        

        

    }

    getAllCount() {
        this._service.get('dashboard/get-all-count').subscribe(res => {
            this.allContent = res.Record;
        }, err => { }
        );
    }

    getMonthlyIncome() {
        this._service.get('dashboard/get-monthly-payment_and_collection').subscribe(res => {
            this.getMonthlyPayment = res.Record;
            this.calculateIncomeCollection(this.getMonthlyPayment)
        }, err => { }
        );
    }

    getBuildingWiseRooms() {
        const obj = {
            date: moment(this.searchForm.value.Date).format('DD-MMM-YYYY')
        };
        this._service.get('dashboard/get-building-wise-rooms', obj).subscribe(res => {
            this.buildingWiseRooms = res.Records;
            console.log(this.buildingWiseRooms[0].Floors);
            this.floorRooms = this.buildingWiseRooms[0].Floors;
        }, err => { }
        );
    }

    calculateIncomeCollection(getMonthlyPayment) {
        let printableReceivables = 0;

        let totalCollections = getMonthlyPayment.Collections;
        let totalReceivables = getMonthlyPayment.Receivables;

        totalCollections.forEach(item => {
            this.printableCollections = this.printableCollections + item;
        });

        totalReceivables.forEach(item => {
            printableReceivables = printableReceivables + item;
        });
    }

    getAllocationDetails(room, template: TemplateRef<any>) {
        const obj = {
            id: room.Id,
            allocatedDate: moment(this.searchForm.value.Date).format('DD-MMM-YYYY')
        };
        this._service.get('room/get-allocation-details', obj).subscribe(res => {
            this.allocationRoomDetails = res.Record;
            this.modalRef = this.modalService.show(template, this.modalConfig);
        }, err => { }
        );
    }

    getCourseEnrollmentCount() {
        const self = this;
        this._service.get("Course/GetCourseEnrollmentCount")
            .subscribe(
                res => {

                    if (!res.Success) {
                        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
                        return;
                    }
                    let dataArr = [];
                    let nameArr = [];

                    res.Records.forEach((element) => {
                        nameArr.push(element.Title);
                        dataArr.push({
                            'y': element.Count,
                            'name': element.Title,
                            'id': element.Id
                        });
                    });

                    this.courseOptions = {
                        chart: {
                            type: "column",
                            scrollablePlotArea: {
                                minWidth: 700,
                                scrollPositionX: 1
                            }
                        },
                        exporting: {
                            buttons: {
                                contextButton: {
                                    menuItems: [{
                                        "textKey": "printChart",
                                        onclick: function () {
                                            this.print();
                                        }
                                    }, {
                                        "separator": true
                                    }, {
                                        "text": "Download Excel",
                                        onclick: function () {
                                            self.downloadExcelFile();
                                        }
                                    }, {
                                        "separator": true
                                    }, {
                                        "textKey": "downloadPNG",
                                        onclick: function () {
                                            this.exportChart();
                                        }
                                    }, {
                                        "textKey": "downloadJPEG",
                                        onclick: function () {
                                            this.exportChart({
                                                type: 'image/jpeg'
                                            });
                                        }
                                    }, {
                                        "textKey": "downloadPDF",
                                        onclick: function () {
                                            this.exportChart({
                                                type: 'application/pdf'
                                            });
                                        }
                                    }, {
                                        "textKey": "downloadSVG",
                                        onclick: function () {
                                            this.exportChart({
                                                type: 'image/svg+xml'
                                            });
                                        }
                                    }]
                                }
                            },
                            //  fallbackToExportServer: false
                        },
                        title: {
                            text: "Course Wise Enrolled Employees"
                        },
                        xAxis: {
                            categories: nameArr,
                            labels: {
                                rotation: -45,
                                style: {
                                    fontSize: '12px',
                                    fontFamily: 'Verdana, sans-serif'
                                },
                                overflow: 'justify'

                            },
                            title: {
                                text: "Course(s)"
                            }
                        },

                        yAxis: {
                            labels: {
                                format: '{value}'
                            },
                            title: {
                                text: "No Of Employee Enrolled"
                            }
                        },
                        credits: {
                            enabled: false
                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            area: {
                                fillOpacity: 0.5
                            },
                            series: {
                                borderWidth: 0,
                                cursor: 'pointer',
                                point: {
                                    events: {
                                        click: function (event) {
                                            console.log(event.point.options);
                                            self.router.navigate(['/course-details-dashboard', event.point.options.id]);
                                            //this.filter.emit([this.category, this.serie.name]);
                                            // alert('Name: '+ this.category + ', Value: ' + this.y + ', Series :' + this.series.name);
                                        }
                                    }
                                }
                            }
                        },
                        tooltip: {
                            // headerFormat:
                            //   '<span style="font-size:11px">{series.name}</span><br>',
                            pointFormat:
                                '<b>{point.y} employee(s) have been enrolled </b>'
                        },

                        series: [
                            {
                                name: "Watched Duration",
                                data: dataArr,
                                dataLabels: {
                                    enabled: true,
                                    rotation: -90,
                                    color: '#FFFFFF',
                                    align: 'right',
                                    format: '{point.y}', // one decimal
                                    y: 20, // 10 pixels down from the top
                                    style: {
                                        fontSize: '13px',
                                        fontFamily: 'Verdana, sans-serif'
                                    }
                                }
                            }
                        ]
                    };
                },
                err => { }
            );
    }

    onPointSelect($event) {
        console.log($event);
    }

    downloadExcelFile() {

        this.blockUI.start('Generating report. Please wait...');
        this._service.downloadFile('Course/GetCourseEnrollmentCountExcel').subscribe(res => {
            this.blockUI.stop();
            const url = window.URL.createObjectURL(res);
            var link = document.createElement('a');
            link.href = url;
            link.download = "Course_Wise_Enrolled_Employees_Report.xlsx";
            link.click();

        },
            error => {
                this.blockUI.stop();
            });
    }

    fixDate(d: Date): Date {
        d.setHours(d.getHours() - d.getTimezoneOffset() / 60);
        return d;
    }

    getDateTimeFormat(value:Date){
        return moment(value).format('DD-MMM-YYYY hh:mm A');
    }

    modalHide() {
        this.modalRef.hide();
    }
    
    openModal(room, template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }
    

    
}
