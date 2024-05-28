import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login(user: any): Promise<any> {
    return this.http
      .post('http://localhost:8101/login/login', user)
      .toPromise();
  }
}
