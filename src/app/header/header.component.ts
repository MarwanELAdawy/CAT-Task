import { FormBuilder } from '@angular/forms';
import { AuthGuard } from './../_helpers/index';
import { LoginComponent } from './../login/login.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models/user';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [LoginComponent, AccountService, FormBuilder]
})
export class HeaderComponent implements OnInit {

  public user: Observable<User>;

  constructor(public _AccountService: AccountService, public _LoginComponent: LoginComponent, http: HttpClient) { }

  ngOnInit(): void {
  }
  auth () {
    return this._AccountService.ifAuthenticated;
  }

  data () {
    return {
      user: this._AccountService.user
    };
  }
  onSubmit(){
    return this._LoginComponent.onSubmit();
  }
}
