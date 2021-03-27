import { Component, TemplateRef, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode,  SelectionType, DatatableComponent} from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { trigger, transition, style, animate } from '@angular/animations';

import {ElementRef} from '@angular/core';

// JISTI RELATED
import '../../assets/data/external_api.js';
declare var JitsiMeetExternalAPI: any;


//SignalR RELATED
import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';



@Component({
    selector: 'app-vclass-host',
    templateUrl: './vclass-host.component.html',
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
                style({ height: 300, opacity: 1 }),
                animate('1s ease-in',
                  style({ height: 0, opacity: 0 }))
              ]
            )
          ]
        )
      ]
})

export class VClassHostComponent implements OnInit {


    // JISTI RELATED
    apiObj = null;
    domain = 'live-class.joogle.xyz';   
    options;
    @ViewChild('jitsi') el:ElementRef;

    

    // SIGNALR RELATED
    private hubConnection: HubConnection;

    
    // COMPONENT RELATED
    public ParticipantList: [];
    public OnGoingClassList: [];
    OnGoingClassListLength =0;
    public currentUser: any;
    public ProjectList: any;
    BatchList: [];
    projectId = '';
    batchId = '';
    currentSocketId = null;
    iframeOpened = false;
    joinConfObj={};


    entryForm: FormGroup;
    submitted = false;
    @BlockUI() blockUI: NgBlockUI;


    // MODAL RELATED
    modalTitle = 'Virtual Class | Host';
    modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalRef: BsModalRef;


    // FORM, PAGE, DATATABLE, DATE RELATED
    page = new Page();    
    selected: any = [];    
    rows = [];
    items = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;
    bsConfig: Partial<BsDatepickerConfig>;
    scrollBarHorizontal = (window.innerWidth < 1200);
    SelectionType = SelectionType;

    

    constructor(
        private authService: AuthenticationService,
        private modalService: BsModalService,
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.page.pageNumber = 0;
        this.page.size = 10;
        window.onresize = () => {
            this.scrollBarHorizontal = (window.innerWidth < 1200);
        };

        this.bsConfig = Object.assign({}, {
            dateInputFormat: 'DD-MMM-YYYY ',
            adaptivePosition: true,
            maxDate: new Date()
        });

        this.currentUser = this.authService.currentUserDetails.value;
    }

    ngOnInit() {

        // SIGNALR RELATED
        this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/pushNotification').build();

        this.hubConnection.start().then(() => {
        console.log('connection started');
        }).catch(err => console.log(err));

        this.hubConnection.onclose(() => {
        // debugger;
        setTimeout(() => {
            console.log('try to re start connection');
            // debugger;
            this.hubConnection.start().then(() => {
            // debugger;
            console.log('connection re started');
            }).catch(err => console.log(err));
        }, 5000);
        });

        this.hubConnection.on('privateMessageMethodName', (data) => {
        // debugger;
        console.log('private Message:' + data);
        alert('private msg is : ' + data);
        });

        this.hubConnection.on('publicMessageMethodName', (data) => {
        // debugger;
        console.log('public Message:' + data);
        alert('public msg is : ' + data);
        });

        this.hubConnection.on('clientMethodName', (data) => {
        // debugger;
        console.log('server message:' + data);
        });

        this.hubConnection.on('XYZMethodTobeListenedTo', (data) => {
            // debugger;
            console.log('XYZMethodTobeListenedTo message:' + data);
            });

        this.hubConnection.on('WelcomeMethodName', (data) => {
        // debugger;
        console.log('client Id:' + data);
        this.currentSocketId = data;

        this.hubConnection.invoke('GetDataFromClient', 'abc@abc.com', data).catch(err => console.log(err));
        });



        //CUSTOM
        this.hubConnection.on('LetHostKnowClassEnded', (hostId) => {
            this.getCurrentOnGoingVirtualClassListByHostId();            
            if(hostId == this.currentUser.Id){
                this.apiObj.executeCommand('hangup');       
                this.apiObj.dispose();                
                this.iframeOpened = false; 
                this.getCurrentOnGoingVirtualClassListByHostId();
            }
        });

        // FORM RELATED
        this.entryForm = this.formBuilder.group({
            Id: [null],
            AcademicProjectId: [null, [Validators.required]],
            AcademicBatchId: [null, [Validators.required]],
        });

        // PAGE ON LOAD RELATED
        this.getProjectList(this.currentUser.Id);
        this.getCurrentOnGoingVirtualClassListByHostId();
    }

   

    // COMPONENTS METHODS

    getProjectList(hostId){
        this._service.get('api/conference/GetProjectListByHostId/' + hostId ).subscribe(res => {
            this.ProjectList = res.Records;
            console.log(this.ProjectList)
        }, err => { }
        );

    }

    changeProject(e) {
        if(e)       {
            this.entryForm.controls['AcademicBatchId'].setValue(null);
        }
        this.projectId = this.entryForm.value.AcademicProjectId;
        this.getBatchList(this.projectId);
        this.ParticipantList = []        
    }

    getBatchList(projectId){
        
        this._service.get('api/conference/GetBatchListByProjectIdAndHostId/' + projectId + "/" + this.currentUser.Id).subscribe(res => {
            this.BatchList = res.Records;
            console.log(this.BatchList)
        }, err => { }
        );

    }

    changeBatch(){
        this.batchId = this.entryForm.value.AcademicBatchId;
        this.getParticipantListByProjectIdBatchIdAndHostId(this.projectId, this.batchId, this.currentUser.Id);
    }

    getParticipantListByProjectIdBatchIdAndHostId(projectId, batchId, hostId){
        console.log(projectId);
        console.log(batchId);
        console.log(hostId);

        
        this._service.get('api/conference/GetParticipantListByProjectIdBatchIdAndHostId/' + projectId + "/" + batchId + '/' + hostId ).subscribe(res => {
            this.ParticipantList = res.Records;
            console.log(this.ParticipantList)
        }, err => { }
        );
    }

    getCurrentOnGoingVirtualClassListByHostId(){
        this._service.get('api/conference/GetCurrentOnGoingVirtualClassListByHostId/' + this.currentUser.Id).subscribe(res => {
            this.OnGoingClassList = res.Records;
            this.OnGoingClassListLength = res.Total;
            console.log(this.OnGoingClassList);
            console.log(this.OnGoingClassListLength);
        }, err => { }
        );
    }

    createVirtualClass(){
        // this.blockUI.start('Starting...');
        console.log(this.entryForm.value.AcademicProjectId)
        console.log(this.entryForm.value.AcademicBatchId)
        //console.log(this.selected)
        const allStudent = this.selected;

        const participantList = [];
        const createConfObj = {
            HostId: this.currentUser.Id,
            ProjectId: this.projectId,
            BatchId: this.batchId,
            ConnectionId : this.currentSocketId,
        }

        console.log("HostId: " + createConfObj.HostId);
        console.log("ParojectId: " + createConfObj.ProjectId);
        console.log("BatchId: " + createConfObj.BatchId);
        console.log("ConnectionId: " + createConfObj.ConnectionId);

        if (allStudent.length > 0 ) {
            allStudent.forEach(function (value) {
                participantList.push({
                    Id: value.ParticipantId
                });
            });
        }

        console.log(participantList);


        if (participantList.length > 0 ) {
            const request = this._service.post('api/conference/CreateVirtualClass', createConfObj);
            request.subscribe(
                data => {
                    this.blockUI.stop();
                    if (data.Success) {
                        this.toastr.success(data.Message, 'Success!', { timeOut: 2000 });
                        this.selected = [];
                        const result = data.Records;

                        const joinConfObj = {
                            "vClassDetail":{
                                "VClassId":result.Id,
                                "RoomId":result.RoomId,
                                "ProjectId":result.ProjectId,
                                "HostId":result.HostId,
                                "BatchId":result.BatchId,
                                "ConnectionId":this.currentSocketId
                            },
                            "participantList": participantList
                        }

                        
                        //NOW JOINING THE MEETING
                        this.joinConferenceByHost(joinConfObj);


                        
                        } 
                        else 
                        {
                            this.toastr.error(data.Message, 'Error!', { closeButton: true, disableTimeOut: false });
                        }
                    },
                err => {
                    this.blockUI.stop();
                    this.toastr.error(err.Message || err, 'Error!', { closeButton: true, disableTimeOut: false });
                }
            );
        }
        else
        {
            this.blockUI.stop();
            this.toastr.error('Please Select Your Student (s) first and then start live class !', 'Error!', { closeButton: true, disableTimeOut: false });
        }
        
    }

    btnHangup(obj){

               

        console.log(this.currentUser.UserType)

        const vclassObj = {
            Id: obj.Id,
            HostId: obj.HostId,
            BatchId: obj.BatchId,
            RoomId: obj.RoomId,
            ConnectionId : this.currentSocketId,
        }

        console.log(vclassObj)

        if(this.currentUser.UserType == 'Host'){
            this._service.post('api/conference/EndVirtualClassByHost', vclassObj).subscribe(data => {
                this.blockUI.stop();
                if (data.Success) {
                    this.toastr.success(data.Message, 'Success!', { timeOut: 2000 });
                    
                    //DESTROYING JISI IFRAME
                    if(this.apiObj != null){
                        this.apiObj.executeCommand('hangup');       
                        this.apiObj.dispose();
                        this.iframeOpened = false;
                    }

                    // RE-CALLING ONGOING CLASS LIST
                    this.getCurrentOnGoingVirtualClassListByHostId();
    
                    
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
        if(this.currentUser.UserType == 'Participant'){
            this._service.post('api/conference/EndVirtualClassByParticipant', vclassObj).subscribe(data => {
                this.blockUI.stop();
                if (data.Success) {
                    this.toastr.success(data.Message, 'Success!', { timeOut: 2000 }); 
                    //DESTROYING JISI IFRAME
                    if(this.apiObj != null){
                        this.apiObj.executeCommand('hangup');       
                        this.apiObj.dispose();
                    }

                    // RE-CALLING ONGOING CLASS LIST
                    this.getCurrentOnGoingVirtualClassListByHostId();                  
    
                    
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

        
        
    }

    //PRIVATE METHODS

    joinConferenceByHost(param){

        console.log("======================");
        console.log(param);
        //Adter successful conference creation, we will let the host join the conference.
        const request = this._service.post('api/conference/JoinVirtualClassByHost', param);
        request.subscribe(
            data => {
                this.blockUI.stop();
                if (data.Success) {
                    this.toastr.success(data.Message, 'Success!', { timeOut: 2000 });
                    
                    //NOW INITIATING JITSI IFRAME
                    this.initiateJitsi(data.Records.RoomId);

                    this.getCurrentOnGoingVirtualClassListByHostId();
                } 
                else 
                {
                    this.toastr.error(data.Message, 'Error!', { closeButton: true, disableTimeOut: false });
                }
                },
                    err => {
                        this.blockUI.stop();
                        this.toastr.error(err.Message || err, 'Error!', { closeButton: true, disableTimeOut: false });
                    }
                );
    }

    initiateJitsi(param){
        this.el.nativeElement.focus();

        this.options = {
            roomName: param,
            width: '100%',
            height: '800px',
            parentNode: this.el.nativeElement,
            userInfo: {
                displayName: this.currentUser.FirstName
            },
            
        
        };
        this.apiObj = new JitsiMeetExternalAPI(this.domain, this.options);
        this.iframeOpened = true;

        
        this.apiObj.addEventListeners({
            readyToClose: function () {
                console.log("hello")
            },
            videoConferenceLeft: function (data) {
                console.log(data.roomName + "hello")
            },
            participantJoined: function(data){
                console.log('participantJoined', data);                
                // alert(data.displayName + " has joined and id is '" + data.id + "'")
            },
            participantLeft: function(data){
                console.log('participantLeft', data);
                // alert("left")
            }
        });     
    }





    // FORM, MODAL, DATE, PAGE RELATED
    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
    }   

    onSelect({ selected }) {
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
        // console.log('Select List', this.selected);
    }
    updateFilter(e){

    }
    get f() {
        return this.entryForm.controls;
    }

    modalHide() {
        this.entryForm.controls['Id'].setValue(0);
        this.modalRef.hide();
        this.submitted = false;
        this.modalTitle = 'Host | Virtual Class';
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    fixDate(d: Date): Date {
        d.setHours(d.getHours() - d.getTimezoneOffset() / 60);
        return d;
    }
}
