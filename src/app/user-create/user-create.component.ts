import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
    selector: 'app-user-create',
    templateUrl: './user-create.component.html',
    styleUrls: ['./user-create.component.css'],
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
                        animate('1s ease-out',
                            style({ height: 0, opacity: 0 }))
                    ]
                )
            ]
        )
    ]
})

export class UserCreateComponent implements OnInit {

    modalRef: BsModalRef;
    entryForm: FormGroup;
    designationForm: FormGroup;
    sectionForm: FormGroup;
    submitted = false;
    sectionSubmitted = false;
    designationSubmitted = false;
    @BlockUI() blockUI: NgBlockUI;
    formTitle = 'User Creation';
    btnSaveText = 'Save';
    id: string;
    isEdit: boolean = false;
    supplier_submitted = false;
    modalTitle = 'Add Designation';
    sectionModalTitle = 'Add Section';

    modalConfig: any = { class: 'gray', backdrop: 'static' };
    modalLgConfig: any = { class: 'gray modal-xl', backdrop: 'static' };

    sectionDropDownList: Array<any> = [];
    designationDropDownList: Array<any> = [];
    inventoryStoreDropDownList: Array<any> = [];
    userRoleList: Array<any> = [];
    permissionList: Array<any> = [];
    UserTypeList: Array<any> = [];
    UserType;
    HeadRoleList;
    headRoleId;
    checked_permission_list: any =[];
    constructor(
        private modalService: BsModalService,
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private toastr: ToastrService,
        private _location: Location,
        private route: ActivatedRoute
    ) {
        if (this.route.snapshot.paramMap.has("id")) {
            this.id = this.route.snapshot.paramMap.get("id");
            this.isEdit = true;
        }
    }


    ngOnInit() {
        this.entryForm = this.formBuilder.group({
            id: [null],
            email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
            first_name: [null, [Validators.required, Validators.maxLength(50)]],
            last_name: [null, [Validators.required, Validators.maxLength(50)]],
            // bp_id: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],th(1000)]],
            phone: [null, [Validators.maxLength(250)]],
            
            HeadRoleId: [null, [Validators.required]],
            UserType: [null, [Validators.required]]
        });

        this.UserTypeList = [
            {
            "Id":1,
            "Name": "Host"
            },
            {
            "Id":2,
            "Name": "Participant"
            },
            {
            "Id":3,
            "Name": "General User"
            },
        ]



        this.getHeadRoleList();
        this.getRoleList();
    }

    

    get f() {
        return this.entryForm.controls;
    }

    get df() {
        return this.designationForm.controls;
    }    

    get sf() {
        return this.sectionForm.controls;
    }

    

    getHeadRoleList() {
        this._service.get('api/role/GetHeadRoleList').subscribe(res => {
            this.HeadRoleList = res.Records;
        }, () => { }
        );
    }

    getRoleList() {
        this.blockUI.start('Getting data. Please wait ...');
        this._service.get('api/role/GetRoleList').subscribe(res => {
            if (!res.Success) {
                this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
                return;
            }
            this.permissionList = [];
            res.Records.forEach(element => {
                this.permissionList.push({
                    Id: element.Id,
                    Name: element.Name,
                    IsSelected: false
                })
            });

            console.log(this.permissionList)
            console.log(this.headRoleId);

            if (this.id)
                this.getItem(this.id);


            this.blockUI.stop();
        }, err => {
            this.blockUI.stop();
            this.toastr.error(err.Message || err, 'Error!', { timeOut: 2000 });
        }
        );
    }

    

    getUserRoles(id) {
        this._service.get('api/role/GetRolesByHeadId/' + id).subscribe(res => {

            console.log(res.Records)
            if (res.Success) {
                // this.entryForm.controls['Id'].setValue(res.Record.Id);
                // this.entryForm.controls['Name'].setValue(res.Record.Name);

                this.permissionList.forEach(x => {
                    const found = res.Records.find(y => y.Id == x.Id);
                    x.IsSelected = found ? true : false;
                });


            }
        });

    }

    changeHeadRole(event) {
        this.headRoleId = this.entryForm.value.HeadRoleId;
        // alert(this.headRoleId);


        this.getUserRoles(event.Id);
    }
    changeUserType(event) {
        this.UserType = this.entryForm.value.UserType;
        console.log(this.UserType);
    }

    

    getItem(id) {
        this.blockUI.start('Getting data...');
        this._service.get('api/user/GetUserDetailWithRoles/' + id).subscribe(res => {
            this.blockUI.stop();
            if (!res.Success) {
                this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: false });
                return;
            }
            this.formTitle = 'Update User';
            this.btnSaveText = 'Update';
            this.entryForm.controls['id'].setValue(res.Record.User.Id);
            this.entryForm.controls['first_name'].setValue(res.Record.User.FirstName);
            this.entryForm.controls['last_name'].setValue(res.Record.User.LastName);
            this.entryForm.controls['email'].setValue(res.Record.User.Email);
            this.entryForm.controls['phone'].setValue(res.Record.User.PhoneNumber);
            this.entryForm.controls['HeadRoleId'].setValue(res.Record.User.HeadRoleId);
            this.entryForm.controls['UserType'].setValue(res.Record.User.UserType);
            this.permissionList.forEach(element => {
                element.IsSelected = res.Record.Roles.indexOf(element.Name) !== -1;
            });

        }, err => {
            this.blockUI.stop();
            this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: false });
        });
    }

   

    onFormSubmit() {
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }
        
        

        //this.blockUI.start('Saving...');

        

        const roleList = [];

        
        this.checked_permission_list = this.permissionList.filter(x => x.IsSelected === true).map(x => x.Name)
        if (this.checked_permission_list.length > 0 ) {
            this.checked_permission_list.forEach(function (value) {
                roleList.push({
                    Name: value
                });
            });
        }
        console.log(roleList)

        const createUserObj = {
            "userObj":{
                Id: this.entryForm.value.id ? this.entryForm.value.id : null,
                FirstName: this.entryForm.value.first_name.trim(),
                LastName: this.entryForm.value.last_name.trim(),            
                Email: this.entryForm.value.email ? this.entryForm.value.email.trim().toLowerCase() : this.entryForm.value.email,            
                PhoneNumber: this.entryForm.value.phone ? this.entryForm.value.phone.trim() : this.entryForm.value.phone,
                HeadRoleId : this.entryForm.value.HeadRoleId,
                UserType: this.entryForm.value.UserType, 

            },
            "roleList":roleList
        }

        console.log(createUserObj);

        if (this.checked_permission_list.length === 0) {
            this.toastr.warning('No role selected!!', 'WARNING!', { timeOut: 3000 });
            return;
        }

        const request = this._service.post('api/user/CreateUser', createUserObj);

        request.subscribe(
            data => {
                this.blockUI.stop();
                if (data.Success) {
                    this.toastr.success(data.Message, 'Success!', { timeOut: 2000 });
                    this._location.back();
                } else {
                    this.toastr.error(data.Message, 'Error!', { closeButton: true, disableTimeOut: false });
                }
            },
            err => {
                this.blockUI.stop();
                this.toastr.error(err.Message || err, 'Error!', { closeButton: true, disableTimeOut: false });
            }
        );

    }

    modalHide() {
        this.designationForm.reset();
        this.sectionForm.reset();
        this.modalRef.hide();
        this.sectionSubmitted = false;
        this.designationSubmitted = false;
        this.modalTitle = 'Add Designation';
        this.sectionModalTitle = 'Add Section';
        this.btnSaveText = 'Create User Now';
    }

}
