import { Component, TemplateRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  encapsulation: ViewEncapsulation.None
})

export class UserComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = 'Add User';
  btnSaveText = 'Save';

  modalLgConfig: any = { class: 'gray modal-xl', backdrop: 'static' };
  modalRef: BsModalRef;

  page = new Page();
  emptyGuid = 0;

  rows = [];
  sectionDropDownList = [];
  designationDropDownList = [];

  loadingIndicator = false;
  ColumnMode = ColumnMode;

  scrollBarHorizontal = (window.innerWidth < 1200);

  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };
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
      designation: [null, [Validators.maxLength(250)]],
      department: [null],
      posting_area: [null, [Validators.maxLength(250)]],
      transferred: [false],
      is_active: [true]
    });
    this.getList();
  }

  get f(){
    return this.entryForm.controls;
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
  }

  getList() {
    this.loadingIndicator = true;
    const obj = {
      size: this.page.size,
      pageNumber: this.page.pageNumber
    };
    this._service.get('api/user/GetUserList', obj).subscribe(res => {
      if (!res.Success) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: false });
        return;
      }
      this.rows = res.Records;
      this.page.totalElements = res.Total;
      this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }, err => {
      this.toastr.error(err.Message || err, 'Error!', { closeButton: true, disableTimeOut: false });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }
    );
  }

  modalHide() {
    this.entryForm.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.modalTitle = 'Add BP User';
    this.btnSaveText = 'Save';
  }

  openModal(template: TemplateRef<any>) {
    this.entryForm.controls['is_active'].setValue(true);
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }


}
