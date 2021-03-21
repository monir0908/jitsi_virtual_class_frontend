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
    selector: 'app-vclass-participant',
    templateUrl: './vclass-participant.component.html',
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

export class VClassParticipantComponent implements OnInit {


    // JISTI RELATED
    apiObj = null;
    domain = 'live-class.joogle.xyz';   
    options;
    @ViewChild('jitsi') el:ElementRef;

    currentSocketId = null;

    // SIGNALR RELATED
    private hubConnection: HubConnection;


    
    public InvitationList: [];
    public currentUser: any;
    iframeOpened = false;

    joinConfObj={};
    
    currentRoomNo = '';


    entryForm: FormGroup;
    syllabusForm: FormGroup;
    submitted = false;
    @BlockUI() blockUI: NgBlockUI;
    modalTitle = 'participant Enrollment Information';
    btnSaveText = 'Save';
    btnAddText = 'Add participant Enrollment';

    emptyGuid = '00000000-0000-0000-0000-000000000000';

    modalConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalRef: BsModalRef;

    page = new Page();
    selected: any = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;

    bsConfig: Partial<BsDatepickerConfig>;

    scrollBarHorizontal = (window.innerWidth < 1200);

    

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
        this.hubConnection.on('LetParticipantKnowClassEnded', (participantId) => {            
            if(participantId == this.currentUser.Id){
                alert("You ended the class !")
                this.apiObj.executeCommand('hangup');       
                this.apiObj.dispose();                
                this.iframeOpened = false; 
                this.getInvitationListByParticipantId();
            }
        });    
        
        this.hubConnection.on('JoinedByHost', (participantId, roomId, hostName) => {            
            if(participantId == this.currentUser.Id){
                alert(hostName + " has started a live class, Room No : " + roomId)                
                this.getInvitationListByParticipantId();
            }
        });    
        this.hubConnection.on('EndedByHost', (participantId, roomId, hostName) => { 
            console.log(participantId);
            
            if(participantId == this.currentUser.Id){
                
                this.getInvitationListByParticipantId();
                if(this.apiObj != null && this.currentRoomNo == roomId){
                    alert(hostName + " has ended the class !")
                    this.apiObj.executeCommand('hangup');       
                    this.apiObj.dispose();                
                    this.iframeOpened = false; 
                }
            }
        });

        this.hubConnection.on('ConnectionLostFromHost', (participantId, roomId, hostName) => {
            
            console.log("participantId");
            console.log(participantId);
            console.log("this.currentRoomNo");
            console.log(this.currentRoomNo);
            
            if(participantId == this.currentUser.Id){
                
                this.getInvitationListByParticipantId();
                if(this.apiObj != null && this.currentRoomNo == roomId){
                    alert("Connection lost from host : " + hostName)
                    this.apiObj.executeCommand('hangup');       
                    this.apiObj.dispose();                
                    this.iframeOpened = false;
                    this.getInvitationListByParticipantId(); 
                }
            }
        });

        this.getInvitationListByParticipantId();
    }



    

    getInvitationListByParticipantId(){
        this._service.get('api/conference/GetInvitationListByParticipantId/' + this.currentUser.Id).subscribe(res => {
            this.InvitationList = res.Records;
            console.log(this.InvitationList);
        }, err => { }
        );
    }

    

    btnHangupByParticipant(obj){
        console.log(this.currentUser.UserType)

        const vclassDetailObj = {
            Id: obj.VClassId,
            HostId: obj.HostId,
            BatchId: obj.BatchId,
            RoomId: obj.RoomId,
            ConnectionId : this.currentSocketId,
            ParticipantId : this.currentUser.Id,
        }

        console.log(vclassDetailObj)

        
        if(this.currentUser.UserType == 'Participant'){
            this._service.post('api/conference/EndVirtualClassByParticipant', vclassDetailObj).subscribe(data => {
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
                    this.getInvitationListByParticipantId();                  
    
                    
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

    joinConferenceByParticipant(param){

        console.log("======================");
        console.log(param);

        const vClassDetail = {
            VClassId : param.VClassId,
            RoomId : param.RoomId,
            ParticipantId : this.currentUser.Id,
            BatchId : param.BatchId,
            ConnectionId : this.currentSocketId,
            

        }
        
        const request = this._service.post('api/conference/JoinVirtualClassByParticipant', vClassDetail);
        request.subscribe(
            data => {
                this.blockUI.stop();
                if (data.Success) {
                    this.toastr.success(data.Message, 'Success!', { timeOut: 2000 });
                    
                    //NOW INITIATING JITSI IFRAME
                    this.initiateJitsi(data.Records.RoomId);
                    this.currentRoomNo = data.Records.RoomId;

                    this.getInvitationListByParticipantId();
                } 
                else 
                {
                    this.toastr.error(data.Message, 'Error!', { closeButton: true, disableTimeOut: false });
                    this.getInvitationListByParticipantId();
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















    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
    }

    

    onSelect({ selected }) {
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
        // console.log('Select List', this.selected);
    }

    
    

    modalHide() {
        this.entryForm.controls['Id'].setValue(0);
        this.syllabusForm.reset();
        this.modalRef.hide();
        this.submitted = false;
        this.modalTitle = 'Add participant Enrollment Information';
        this.btnSaveText = 'Save';
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    
}
