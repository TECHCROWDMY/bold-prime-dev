import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FundsDepositWithdrawService {

  types: any = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8';
  headers: any = new HttpHeaders()
    .set('Accept', this.types);

  constructor(private httpClient: HttpClient) { }



  fundsHandle(ApiNameExport: any, body: any): Observable<any> {
    return this.httpClient.post(ApiNameExport, body,
      {
        responseType: 'text',
        headers: this.headers,
        observe: 'response'
      })
  }
}

