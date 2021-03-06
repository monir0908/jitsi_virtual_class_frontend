import { Component, TemplateRef, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode,  SelectionType, DatatableComponent} from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { BsDatepickerConfig, BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { trigger, transition, style, animate } from '@angular/animations';
import * as moment from 'moment';

@Component({
    selector: 'app-vclass-history-host-individual',
    templateUrl: './vclass-history-host-individual.component.html',
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

export class VclassHistoryHostIndividualComponent implements OnInit {


    
    
    // COMPONENT RELATED
    public CallRecords= [];
    public CallDetail= [];
    public AlreadyMergedHostList= [];
    public AlreadyMergedParticipantList= [];
    public OnGoingClassList: [];
    OnGoingClassListLength =0;
    public currentUser: any;
    public ProjectList: any;
    BatchList: [];
    projectId = '';
    batchId = '';
    hostId = '';
    currentSocketId = null;
    iframeOpened = false;
    joinConfObj={};

    btnSaveText = 'Search';


    entryForm: FormGroup;
    submitted = false;
    @BlockUI() blockUI: NgBlockUI;


    // MODAL RELATED
    modalTitle = 'Host Individual Call History';
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
    bsrConfig: Partial<BsDaterangepickerConfig>;
    
    scrollBarHorizontal = (window.innerWidth < 1200);
    SelectionType = SelectionType;

    bsValue = new Date();
    bsRangeValue: Date[];
    maxDate = new Date();

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

        

        this.maxDate.setDate(this.maxDate.getDate() + 0);
        this.bsRangeValue = [this.bsValue, this.maxDate];

        this.currentUser = this.authService.currentUserDetails.value;
    }

    ngOnInit() {        

        // FORM RELATED
        this.entryForm = this.formBuilder.group({
            Id: [null],
            AcademicProjectId: [null, [Validators.required]],
            AcademicBatchId: [null, [Validators.required]],
            HostId: [null, [Validators.required]],
        });

        // PAGE ON LOAD RELATED
        this.getProjectList();
        console.log(this.bsRangeValue[0]);
        console.log(this.bsRangeValue[1]);
    }

   

    // COMPONENTS METHODS

    getProjectList(){
        const obj = {
            size: this.page.size,
            pageNumber: this.page.pageNumber
            };

        this._service.get('api/mastersetting/GetProjectList', obj).subscribe(res => {
            this.ProjectList = res.Records;
            console.log(this.ProjectList)
        }, err => { }
        );

    }

    changeProject(e) {
        if(e)       {
            this.entryForm.controls['AcademicBatchId'].setValue(null);
            this.entryForm.controls['HostId'].setValue(null);
        }

        this.projectId = this.entryForm.value.AcademicProjectId;
       
        this.CallRecords = []
        this.AlreadyMergedParticipantList = []
        this.getBatchList(this.projectId);
    }


    getBatchList(projectId){
        
        this._service.get('api/conference/GetBatchListByProjectId/' + projectId).subscribe(res => {
            this.BatchList = res.Records;
            console.log(this.BatchList)
        }, err => { }
        );

    }

    changeBatch(e){
        this.batchId = this.entryForm.value.AcademicBatchId;
    }

    clear(e){
        if(e){
            this.BatchList = [];
            this.CallRecords = [];
            this.entryForm.controls['AcademicBatchId'].setValue(null);
            this.entryForm.controls['AcademicProjectId'].setValue(null);
            
        } 
    }



    onValueChange(e){ 
        // if(e)       {
        //     this.entryForm.controls['HostId'].setValue(null);
        // }
        console.log(this.bsRangeValue[0]);
        console.log(this.bsRangeValue[1]);
    }
    

    

    

    changeHost(){
        this.projectId = this.entryForm.value.AcademicProjectId; 
        this.batchId = this.entryForm.value.AcademicBatchId; 
        this.hostId = this.entryForm.value.HostId; 
        // this.getVirtualClassCallingDetailByHostId();

    }

    
    search(){
        this.projectId = this.entryForm.value.AcademicProjectId; 
        this.batchId = this.entryForm.value.AcademicBatchId; 
        this.hostId = this.entryForm.value.HostId;
        this.getVirtualClassCallingDetailByHostId(); 

    }


    getVirtualClassCallingDetailByHostId(){

        const obj = {
            size: this.page.size,
            pageNumber: this.page.pageNumber
            };
    
            const qObj = {
                projectId: this.projectId??0,
                batchId: this.batchId??0,
                hostId: this.currentUser.Id,
                startDate : moment(this.bsRangeValue[0]).format('DD-MMM-YYYY')  , 
                endDate: moment(this.bsRangeValue[1]).format('DD-MMM-YYYY')
            }
    
            console.log(qObj);
    
            this._service.get('api/conference/GetVirtualClassCallingDetail/', qObj).subscribe(res => {
                // alert(this.hostId);
                this.CallRecords = res.Records;
                console.log(this.CallRecords)
                if (res.Total == 0) {
                    this.toastr.warning('No record found !', 'Warning!', { timeOut: 2000 });
                  }
            }, err => { }
            );
    }

    

    getCallDetailById(classId){
        // alert(classId);
        // var url = this.router.navigate(['/vclass-history-detail-host/' + classId]);
        const url = this.router.serializeUrl(this.router.createUrlTree(['/vclass-history-detail-host/' + classId]));
        window.open(url, '_blank');      
        

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
