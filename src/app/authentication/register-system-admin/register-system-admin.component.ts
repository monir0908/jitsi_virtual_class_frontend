import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthenticationService} from '../../_services/authentication.service';
import { MustMatch } from '../../_helpers/must-match.validator';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-register-system-admin',
  templateUrl: './register-system-admin.component.html'
})
export class RegisterSystemAdminComponent implements OnInit {
  RegistrerForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  constructor(
    public formBuilder: FormBuilder,
     private authService : AuthenticationService,
     private toastr: ToastrService,
     private router: Router
     ) { }

  ngOnInit() {
    this.RegistrerForm = this.formBuilder.group({
      Email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      ConfirmPassword: ['', Validators.required],
      FirstName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
    }, {
      validator: MustMatch('Password', 'ConfirmPassword')
  });
  }

  get f() {
    return this.RegistrerForm.controls;
  }

  onRegisterSubmit() {
    this.submitted = true;
    if (this.RegistrerForm.invalid  ) {
      return;
    }

    this.blockUI.start('Registering...');

    const obj = {
      Email: this.RegistrerForm.value.Email.trim(),
      Password: this.RegistrerForm.value.Password.trim(),
      FirstName: this.RegistrerForm.value.FirstName.trim(),
      LastName: this.RegistrerForm.value.LastName.trim()
    };

    this.authService.registerSystemAdmin('Account/RegisterAdmin', obj).subscribe(
      data => {
        this.blockUI.stop();
        if (data.Success) {
          this.toastr.success(data.Message, 'Success!', { timeOut: 2000 });
          this.router.navigate(['/admin/login']);
        }else {
         this.toastr.error(data.Message, 'Error!', { timeOut: 2000 });
        }
      },
      error => {
        this.blockUI.stop();
      }
    );

  }




}
