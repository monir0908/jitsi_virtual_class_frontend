import { Component, TemplateRef, OnInit, ViewEncapsulation, ViewChild, HostListener } from '@angular/core';
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
//SignalR RELATED



import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';


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

    currentConf = {
        // Id : null,
        // RoomId : null,
        // HostId : null,
        // ParticipantId : null,
        // BatchId : null,
        // CreatedDateTime : null,
        // Status : null
        // SocketId : null
    }

    hasJoined = false;


    currentSocketId = null;

    // SIGNALR RELATED
    private hubConnection: HubConnection;

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

    }

    
}
