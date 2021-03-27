import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from './../_models/page';
import { AuthenticationService } from './../_services/authentication.service';
import { Router } from '@angular/router';
// import * as moment from 'moment';

@Component({
    selector: 'app-user-role-list',
    templateUrl: './user-role-list.component.html',
    encapsulation: ViewEncapsulation.None
})

export class UserRoleListComponent implements OnInit {

    entryForm: FormGroup;
    submitted = false;
    modalTitle = 'Create User';
    isUpdate = false;
    saveButtonText: string = 'Save';
    @BlockUI() blockUI: NgBlockUI;
    @ViewChild('dataTable', { static: false }) table: any;

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
        private toastr: ToastrService,
        private router: Router
    ) {
        this.page.pageNumber = 0;
        this.page.size = 20;
    }


    ngOnInit() {

        this.getList();
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
        this._service.get('api/role/list', obj).subscribe(res => {
            if (!res.Success) {
                this.toastr.error(res, 'Error!', { closeButton: true, disableTimeOut: false });
                return;
            }
            this.rows = res.Records;
            this.page.totalElements = this.rows.length;
            this.page.totalPages = this.page.totalElements / this.page.size;
            setTimeout(() => {
                this.loadingIndicator = false;
            }, 1000);
        }, err => {
            this.toastr.error(err.Message || err, 'Error!', { closeButton: true, disableTimeOut: false });
            setTimeout(() => {
                this.loadingIndicator = false;
            }, 1000);
        });
    }

    toggleExpandRow(row) {
        console.log(row)
    
      if(!row.details) row.details = row.Roles.map(element => {
       return element = element.split('_').join(' ');
      });
      this.table.rowDetail.toggleExpandRow(row);

    }

    getItem(item){
      this.router.navigate(['/user-role-create/'+ item.Id]);
    }




}
