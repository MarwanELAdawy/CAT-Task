import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../_models/user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    state: {
      state: {
        idToken: null,
        userId: null,
        user: null
      }
    };

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(email, password): Observable<any> {
        return this.http.post<User>(`${environment.apiUrl}/auth/login`,{
              email,
              password
          }, httpOptions);
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        localStorage.clear();
        this.userSubject.next(null);
        this.router.navigate(['/home']);
    }

    register(user: User): Observable<any> {
        return this.http.post(`${environment.apiUrl}/auth/register`, {
          name: user.name,
          email: user.email,
          company: user.company,
          title: user.title,
          country: user.country,
          phone: user.phone,
          keep_updated: user.keep_updated,
          password: user.password
        }, httpOptions);
    }

    ifAuthenticated (state) {
      return state.idToken !== null;
    }
}
