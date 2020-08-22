import { User } from './_models/user';
import axios from 'axios';
import { AxiosInstance } from 'axios';
import { ErrorHandler } from '@angular/core';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


export interface Params {
  [ key: string ]: any;
}

export interface GetOptions {
  url: string;
  params?: Params;
}
export interface ErrorResponse {
  id: string;
  code: string;
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class ApiClient {

  private axiosClient: AxiosInstance;
  private errorHandler: ErrorHandler;

  constructor(errorHandler: ErrorHandler) {
    this.errorHandler = errorHandler;
    // The ApiClient wraps calls to the underlying Axios client.
    this.axiosClient = axios.create({
      timeout: 3000,
      headers: {
        'X-Initialized-At': Date.now().toString()
      }
    });
   }
   public async get<T>( options: GetOptions ): Promise<T> {
		try {
			var axiosResponse = await this.axiosClient.request<T>({
				method: 'get',
				url: options.url,
				params: options.params
			});
			return( axiosResponse.data );
		} catch ( error ) {
			return( Promise.reject( this.normalizeError( error ) ) );
    }
  }
  public async post<T>(_user: User): Promise<T>{
    try{
      const axiosRequest = await this.axiosClient.post<T>(`${environment.apiUrl}/auth/register`, {
          name: _user.name,
          email: _user.email,
          company: _user.company,
          title: _user.title,
          country: _user.country,
          phone: _user.phone,
          keep_updated: _user.keep_updated,
          password: _user.password
      }).then((response) => {
        console.log('saved successfully');
      });
    }
    catch ( error ) {
      return( Promise.reject( this.normalizeError( error ) ) );
    }
  }
  private normalizeError( error: any ): ErrorResponse {
    this.errorHandler.handleError( error );
    return({
      id: '-1',
      code: 'UnknownError',
      message: 'An unexpected error occurred.'
    });
  }
}
