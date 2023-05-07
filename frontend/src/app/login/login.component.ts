import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from '../shared/global-constants';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private snackbarService: SnackbarService ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      senha: [null, Validators.required]
    });
  }

  handleSubmit() {
    let formData = this.loginForm.value;
    let data = {
      email: formData.email,
      senha: formData.senha
    };

    this.userService.login(data).subscribe((resp: any) => {
      this.dialogRef.close();
      localStorage.setItem('token', resp.token);
      this.router.navigate(['/cafe/dashboard']);
    }, (error) => {
      if(error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }
}
