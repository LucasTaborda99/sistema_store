// Componente da tela de cadastrar

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: any = FormGroup;
  responseMessage!: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      nome: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.nomeRegex)],
      ],
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.emailRegex)],
      ],
      numero_contato: [
        null,
        [
          Validators.required, Validators.pattern(GlobalConstants.numeroContatoRegex)],
      ],
      senha: [null, [Validators.required]],
    });
  }

  handleSubmit() {
    let formData = this.signupForm.value;
    var data = {
      nome: formData.nome,
      email: formData.email,
      numero_contato: formData.numero_contato,
      senha: formData.senha
    };

    this.userService.signup(data).subscribe(
      (resp: any) => {
        this.signupForm.reset();
        this.responseMessage = resp?.message;
        this.snackBar.openSnackBar(this.responseMessage, '');
      },
      (error) => {
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }
}
