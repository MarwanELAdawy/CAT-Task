import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import axios from 'axios';
import { AxiosInstance } from 'axios';
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
        return this.http.post<User>(`${environment.apiUrl}/auth/login`, {
              email,
              password
          }, httpOptions);
      }
    // loginn(email, password){
    //   let observable$ = Observable.create((observer)=>
    //   axios.get(`${environment.apiUrl}/auth/login`, {
    //     params: {
    //       email,
    //       password
    //     }
    //   })
    //   .then(function (response) {
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //       console.error(error);
    //   })
    // }
    logiin({commit}, authData) {
      axios.post(`${environment.apiUrl}/auth/login`, {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
      .then(res => {
        console.log(res);
        commit('authUser', {
          token: res.data.idToken,
          userId: res.data.localId
        })
          localStorage.setItem('token', res.data.idToken);
          localStorage.setItem('userId', res.data.localId);
      })
      .catch(error => console.log(error));
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
