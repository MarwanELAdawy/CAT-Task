import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models/user';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public user: Observable<User>;

  constructor(public _AccountService: AccountService) { }

  ngOnInit(): void {
  }
  auth () {
    return this._AccountService.ifAuthenticated;
  }
  onLogout() {
    this._AccountService.logout();
  }

}
