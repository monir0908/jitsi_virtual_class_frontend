import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from './../_models/page';
import { AuthenticationService } from './../_services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';

// import * as moment from 'moment';

@Component({
    selector: 'app-user-role-create',
    templateUrl: './user-role-create.component.html',
    encapsulation: ViewEncapsulation.None
})

export class UserRoleCreateComponent implements OnInit {

    entryForm: FormGroup;
    submitted = false;
    modalTitle = 'Create User';
    isUpdate = false;
    saveButtonText: string = 'Save';
    @BlockUI() blockUI: NgBlockUI;
    permission;
    public permissionList: Array<any> = [];
    id;

    constructor(
        private modalService: BsModalService,
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private authService: AuthenticationService,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
      if(this.route.snapshot.paramMap.has("id")){
        this.id = parseInt(this.route.snapshot.paramMap.get("id"));
      }

    }


    ngOnInit() {

        this.entryForm = this.formBuilder.group({
            id: [null],
            name: [null, [Validators.required]],
            description: [null],

        });
        this.getPermisstionList();
    }

    get f() {
        return this.entryForm.controls;
    }


    getPermisstionList() {
      this.blockUI.start('Getting data. Please wait ...');
        this._service.get('api/rolegroup/permission/list').subscribe(res => {
            if (!res.Success) {
                this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
                return;
            }
            this.permissionList = [];
            res.Records.forEach(element => {
              this.permissionList.push({
                Id:element.Id,
                Name:element.Name,
                IsSelected: false
              })
            });


              if(this.id) this.getUserRoles(this.id);


            this.blockUI.stop();
        }, err => {
          this.blockUI.stop();
            this.toastr.error(err.Message || err, 'Error!', { timeOut: 2000 });
        }
        );
    }



    onFormSubmit() {
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        let permissions = [];
        permissions =  this.permissionList.filter(x=> x.IsSelected == true).map((x)=>  x.Id );

        if (permissions.length === 0) {
          this.toastr.warning('No Permission Selected!!', 'WARNING!', { timeOut: 3000 });
          return;
      }
        this.blockUI.start('Saving data...');
        const obj = {
            Id: this.entryForm.value.id ? this.entryForm.value.id : 0,
            Name: this.entryForm.value.name.trim(),
            Description: this.entryForm.value.description ? this.entryForm.value.description.trim() : null,
            Roles: permissions
        };

        const request = this._service.post('user-role/create-or-update', obj);

        request.subscribe(
            res => {
                this.blockUI.stop();
                if (!res.Success) {
                    this.toastr.error(res, 'Error!', { closeButton: true, disableTimeOut: false });
                    return;
                }
                this.router.navigate(['/user-role-list']);
                this.toastr.success('Successfully Created', 'Success!', { timeOut: 2000 });

            },
            error => {
                this.toastr.error(error.message || error, 'Error!', { closeButton: true, disableTimeOut: false });
                this.blockUI.stop();
            }
        );

    }

    getUserRoles(id) {
      this._service.get('user-role/get/'+id).subscribe(res => {
        if (res.Success) {
          this.entryForm.controls['id'].setValue(res.Record.Id);
          this.entryForm.controls['name'].setValue(res.Record.Name);
          this.entryForm.controls['description'].setValue(res.Record.Description);

            this.permissionList.map(x=>  {
             x.IsSelected =  res.Record.Roles.indexOf(x.Id) != -1
            });


        }
      });

    }

}
