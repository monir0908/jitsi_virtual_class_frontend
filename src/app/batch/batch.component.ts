import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import { Page } from '../_models/page';


@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  encapsulation: ViewEncapsulation.None
})

export class BatchComponent implements OnInit {  

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  formTitle = 'Add Batch';
  btnSaveText = 'Save';

  page = new Page();
  emptyGuid = '00000000-0000-0000-0000-000000000000';
  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;

  scrollBarHorizontal = (window.innerWidth < 1200);

  constructor(
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };
  }


  ngOnInit() {
    this.entryForm = this.formBuilder.group({
      Id: [null],
      BatchName: [null, [Validators.required, Validators.maxLength(250)]]
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
    console.log("CALLED")
    this.loadingIndicator = true;
    const obj = {
      size: this.page.size,
      pageNumber: this.page.pageNumber
    };

    
    this._service.get('api/mastersetting/GetBatchList', obj).subscribe(res => {

      if (!res.Success) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: true });
        return;
      }
      this.rows = res.Records;
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

  getItem(id) {
    this.blockUI.start('Getting data...');
    this._service.get('api/mastersetting/GetBatchDetailById/' + id).subscribe(res => {

      this.blockUI.stop();

      if (!res.Success) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      console.log(res.Record);
      this.formTitle = 'Update Batch';
      this.btnSaveText = 'Update';
      this.entryForm.controls['Id'].setValue(res.Record.Id);
      this.entryForm.controls['BatchName'].setValue(res.Record.BatchName);
    }, err => {
      this.blockUI.stop();
      this.toastr.error(err.Message || err, 'Error!', { closeButton: true, disableTimeOut: true });
    });
  }

  onFormSubmit() {
    this.submitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    this.blockUI.start('Saving...');

    const obj = {
      Id: this.entryForm.value.Id ? this.entryForm.value.Id : 0,
      BatchName: this.entryForm.value.BatchName.trim()
    };
    
    const request = this._service.post('api/mastersetting/CreateOrUpdateBatch', obj);

    request.subscribe(
      data => {
        this.blockUI.stop(); 
        if (data.Success) {
          this.toastr.success(data.Message, 'Success!', { timeOut: 2000 });
          this.clearForm();


          this.getList();

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

  clearForm() {
    this.entryForm.reset();
    this.submitted = false;
    this.formTitle = 'Add Batch';
    this.btnSaveText = 'Save';
    // this.entryForm.controls['IsActive'].setValue(true);
  }
}
