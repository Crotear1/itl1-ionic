import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  register(user: any): Promise<any> {
    return this.http
      .post('http://localhost:8101/login/register', user)
      .toPromise();
  }
}
