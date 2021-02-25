import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from './../_models/page';
import { AuthenticationService } from './../_services/authentication.service';
import { MustMatch } from './../_helpers/must-match.validator';

// import * as moment from 'moment';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  encapsulation: ViewEncapsulation.None
})

export class UserListComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  modalTitle = 'Create User';
  isUpdate = false;
  saveButtonText: string = 'Save';
  @BlockUI() blockUI: NgBlockUI;

  modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;

  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  public categoryList: Array<any> = [];

  page = new Page();

  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private authService: AuthenticationService,
    private toastr: ToastrService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 20;
  }


  ngOnInit() {

    this.entryForm = this.formBuilder.group({
      id: [null],
      Email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
      Password: [null, [Validators.required, Validators.minLength(6)]],
      ConfirmPassword: [null, [Validators.required, Validators.minLength(6)]],
      FirstName: [null, [Validators.required, Validators.maxLength(50)]],
      LastName: [null, [Validators.required, Validators.maxLength(50)]],
      IsActive: [true, [Validators.required]]
    }, {
      validator: MustMatch('Password', 'ConfirmPassword')
    });
    this.getList();
  }

  get f() {
    return this.entryForm.controls;
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
  }

  getList() {
    this.loadingIndicator = true;
    this._service.get('Account/GetUserList', this.page).subscribe(res => {
      if (!res.Success) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.rows = res.Records;
      this.page.totalElements = this.rows.length;
      this.page.totalPages = this.page.totalElements / this.page.size;
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }, err => { }
    );
  }

  onFormSubmit() {
    this.submitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    this.blockUI.start('Saving data...');
    const obj = {
      Id: this.entryForm.value.id,
      Email: this.entryForm.value.Email.trim(),
      Password: this.entryForm.value.Password.trim(),
      FirstName: this.entryForm.value.FirstName.trim(),
      LastName: this.entryForm.value.LastName.trim(),
      IsActive: this.entryForm.value.IsActive
    };

    this._service.post('Account/CreateOrUpdateUser', obj).subscribe(
      res => {
        this.blockUI.stop();
        if (!res.Success) {
          this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
          return;
        }

        this.toastr.success(res.Message, 'Success!', { timeOut: 2000 });
        this.modalHide();
        this.getList();
      },
      error => {
        this.blockUI.stop();
      }
    );

  }

  modalHide() {
    this.entryForm.reset();
    this.modalRef.hide();
    this.isUpdate = false;
    this.submitted = false;
    this.modalTitle = 'Create User';
    this.saveButtonText = 'Save';
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  getItem(id, template: TemplateRef<any>) {
    this.blockUI.start('Saving...');
    this._service.get('Account/GetUserById/' + id).subscribe(res => {
      this.blockUI.stop();
      if (!res.Success) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.entryForm.controls['id'].setValue(res.Record.Id);
      this.entryForm.controls['FirstName'].setValue(res.Record.FirstName);
      this.entryForm.controls['LastName'].setValue(res.Record.LastName);
      this.entryForm.controls['Email'].setValue(res.Record.Email);
      this.entryForm.controls['IsActive'].setValue(res.Record.IsActive);
      this.entryForm.controls['Password'].setValue('********');
      this.entryForm.controls['ConfirmPassword'].setValue('********');

      this.modalTitle = 'Update User';
      this.saveButtonText = 'Update';
      this.modalRef = this.modalService.show(template, this.modalConfig);
    }, err => {
      this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
      this.blockUI.stop();
    }
    );
  }
}
