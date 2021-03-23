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
import * as moment from 'moment';

@Component({
    selector: 'app-vclass-history-detail-host',
    templateUrl: './vclass-history-detail-host.component.html',
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

export class VclassHistoryDetailHostComponent implements OnInit {


    
    
    // COMPONENT RELATED
    public CallRecords= [];
    public CallDetail;
    public StudentVirtualClassDetail= [];
    public TeacherVirtualClassDetail;
    public currentUser: any;
    vclassId = '';
    currentSocketId = null;


    entryForm: FormGroup;
    submitted = false;
    @BlockUI() blockUI: NgBlockUI;


    // MODAL RELATED
    modalTitle = 'Project Batch Host Participant';
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
        this.vclassId = this.route.snapshot.paramMap.get("vclassId");
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
        this.getVirtualClassDetailById();
    }

   

    // COMPONENTS METHODS

    getVirtualClassDetailById(){
        this._service.get('api/conference/GetVirtualClassDetailById/' + this.vclassId).subscribe(res => {
            // alert(this.hostId);
            this.CallDetail = res.Records;
            console.log(this.CallDetail)

            this.StudentVirtualClassDetail = [];
            this.TeacherVirtualClassDetail = [];
            res.Records.VirtualClassDetail.forEach((value, key) => {
                if(value.HostId == null){
                    this.StudentVirtualClassDetail.push({value});
                }
                    
                else{
                    this.TeacherVirtualClassDetail.push({value});

                }
            });
            console.log(this.StudentVirtualClassDetail);
            console.log(this.TeacherVirtualClassDetail);
        }, err => { }
        );

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

    getDateTimeFormat(value:Date){
        return moment(value).format('DD-MMM-YYYY hh:mm:ss A');
}
}
