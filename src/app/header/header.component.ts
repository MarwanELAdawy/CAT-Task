import { RegisterComponent } from './../register/register.component';
import { FormBuilder } from '@angular/forms';
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
  providers: [RegisterComponent, AccountService, FormBuilder]
})
export class HeaderComponent implements OnInit {

  public user: Observable<User>;
  loading = false;

  constructor(public _AccountService: AccountService, public _RegisterComponent: RegisterComponent, http: HttpClient) { }

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
    return this._RegisterComponent.onSubmit();
  }
}
