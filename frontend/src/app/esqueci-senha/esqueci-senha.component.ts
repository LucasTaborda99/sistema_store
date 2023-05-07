import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-esqueci-senha',
  templateUrl: './esqueci-senha.component.html',
  styleUrls: ['./esqueci-senha.component.scss']
})
export class EsqueciSenhaComponent implements OnInit {
  esqueciSenhaForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackbarService: SnackbarService ) { }

  ngOnInit(): void {
    this.esqueciSenhaForm = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.pattern(GlobalConstants.nomeRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]]
    });
  }

  handleSubmit() {
    let formData = this.esqueciSenhaForm.value;
    let data = {
      nome: formData.nome,
      email: formData.email
    };

    this.userService.esqueciSenha(data).subscribe((resp: any) => {
      this.esqueciSenhaForm.reset();
      this.responseMessage = resp?.message;
      this.snackbarService.openSnackBar(this.responseMessage, '')
    }, (error) => {
      if(error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }

}
