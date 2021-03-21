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







@Component({
    selector: 'app-project-batch',
    templateUrl: './project-batch.component.html',
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

export class ProjectBatchComponent implements OnInit {


       
    // COMPONENT RELATED
    public ParticipantList: [];
    public OnGoingClassList: [];
    OnGoingClassListLength =0;
    public currentUser: any;
    public ProjectList: any;
    MergeableBatchList: [];
    ExistingBatchList: [];
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
       

        // FORM RELATED
        this.entryForm = this.formBuilder.group({
            Id: [null],
            AcademicProjectId: [null, [Validators.required]],
            AcademicBatchId: [null, [Validators.required]],
        });

        // PAGE ON LOAD RELATED
        this.getProjectList();
    }

   

    // COMPONENTS METHODS

    getProjectList() {
    
      this.loadingIndicator = true;
      const obj = {
        size: this.page.size,
        pageNumber: this.page.pageNumber
      };
  
      
      this._service.get('api/mastersetting/GetProjectList', obj).subscribe(res => {
  
        if (!res.Success) {
          this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
          return;
        }
        this.ProjectList = res.Records;
        // this.page.totalElements = res.Total;
        // this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
        setTimeout(() => {
          this.loadingIndicator = false;
        }, 1000);
      }, err => {
        this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true });
        setTimeout(() => {
          this.loadingIndicator = false;
        }, 1000);
      }
      );
    }

    changeProject(e) {
        if(e)       {
            this.entryForm.controls['AcademicBatchId'].setValue(null);
        }

        this.projectId = this.entryForm.value.AcademicProjectId;
        this.getBatchListByProjectId(this.projectId);
        this.getMergeableBatchListByProjectId(this.projectId);
        this.ParticipantList = []
        
    }

    getBatchListByProjectId(projectId){
        
        this._service.get('api/conference/GetBatchListByProjectId/' + projectId).subscribe(res => {
            this.ExistingBatchList = res.Records;
            console.log(this.ExistingBatchList)


            
        }, err => { }
        );

    }

    getMergeableBatchListByProjectId(projectId){      
        
      this._service.get('api/mastersetting/getMergeableBatchListByProjectId/'+ projectId).subscribe(res => {
          this.MergeableBatchList = res.Records;
          console.log(this.MergeableBatchList)
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


    mergeprojectbatch(){
      // this.blockUI.start('Starting...');
      console.log(this.entryForm.value.AcademicProjectId)      
      const selectedItmes = this.selected;

      const mergeList = [];
      const projectId = this.entryForm.value.AcademicProjectId

      if (selectedItmes.length > 0 ) {
        selectedItmes.forEach(function (value) {
            mergeList.push({
                  BatchId: value.Id,
                  ProjectId: projectId
              });
          });
      }

      console.log(mergeList);


      if (mergeList.length > 0 ) {
          const request = this._service.post('api/mastersetting/MergeProjectBatch', mergeList);
          request.subscribe(
              data => {
                  this.blockUI.stop();
                  if (data.Success) {
                      this.toastr.success(data.Message, 'Success!', { timeOut: 2000 });
                      this.selected = [];

                      this.getBatchListByProjectId(projectId);
                      this.getMergeableBatchListByProjectId(projectId);
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
          this.toastr.error('Please Select Your Student (s) first and then try again !', 'Error!', { closeButton: true, disableTimeOut: false });
      }
      
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
