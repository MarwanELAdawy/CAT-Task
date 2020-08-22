import { User } from './../_models/user';
import { AlertService } from '../_services/alert.service';
import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { FormBuilder, FormGroup, Validators, EmailValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';
import { ApiClient } from '../axioshttp.service';
import { environment } from 'src/environments/environment';
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
    private apiClient: ApiClient,
    private alertService: AlertService) {
      this.apiClient = apiClient;
      this.users = [];
      document.cookie = 'XSRF-TOKEN=server-generated-token';
    }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
    this.form = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }
  auth () {
    return this._AccountService.ifAuthenticated;
  }
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit(){
    this.submitted = true;
    // reset alerts on submit
    this.alertService.clear();
    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }
    this.loading = true;
    this.apiClient.get<User[]>({
      url: `${environment.apiUrl}/auth/login`,
      params: {
        limit: 10,
        email: this.f.email.value,
        password: this.f.password.value
      }
    }).then(
      data => {
        // this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.reloadPage();
      }
    ).catch(
      error => {
          this.alertService.error(error);
          this.loading = false;
          this.errorMessage = error.error.message;
          this.isLoginFailed = true;
      });
  }
  reloadPage(): void {
      window.location.reload();
  }
}
