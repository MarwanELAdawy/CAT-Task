import { Subscription } from 'rxjs';
import { User } from './../_models/user';
import { AlertService } from '../_services/alert.service';
import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { FormBuilder, FormGroup, Validators, EmailValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';
import { environment } from 'src/environments/environment';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AccountService, FormBuilder]
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  public users: User[];

  constructor(public _AccountService: AccountService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private accountService: AccountService,
              private tokenStorage: TokenStorageService,
              private alertService: AlertService) {
      this.users = [];
      document.cookie = 'XSRF-TOKEN=server-generated-token';
    }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }
  auth() {
    return this._AccountService.ifAuthenticated;
  }
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit(){
    this.submitted = true;
    this.alertService.clear();
    if (this.form.invalid) {
        return;
    }
    this.loading = true;
    this.accountService.login(this.f.username.value, this.f.password.value).pipe(first())
    .subscribe(
        data => {
            console.log(data);
            this.router.navigate([this.returnUrl]);
        },
        error => {
            this.alertService.error(error);
            this.loading = false;
        });
    }
}
