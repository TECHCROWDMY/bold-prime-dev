import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}
  /**
   *
   * @param apiName: request api name
   * @param body : request body parameters
   * @returns
   */

  private sidebarStatus: any = false;
  private depositpaymentStatus: any;

  public getSideBarStatus() {
    return this.sidebarStatus;
  }
  public updateSideBarStatus() {
    this.sidebarStatus = true;
  }
  public SideBarUpdateByMenu() {
    this.sidebarStatus = !this.sidebarStatus;
  }

  
  public callApiPostRequest(apiName: string, body: any) {
    
    return this.httpClient.post(apiName + '?version=1.0.0', body).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  callApiPostRequest2(apiName: string, body: any) {
    const serializedBody = body;

    return this.httpClient.post(apiName, serializedBody).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  public callApiGetRequest(apiName: string, body: any) {
    return this.httpClient.get(apiName, body).pipe(
      map((res) => {
        return res ? res : undefined;
      })
    );
  }
  public callApiPutRequest(apiName: string, body: any) {
    return this.httpClient.put(apiName, body).pipe(
      map((res) => {
        return res ? res : undefined;
      })
    );
  }
  public callApiPatchRequest(apiName: string, body: any) {
    return this.httpClient.patch(apiName, body).pipe(
      map((res) => {
        return res ? res : undefined;
      })
    );
  }
  public callApiDeleteRequest(apiName: string, body: any) {
    return this.httpClient.delete(apiName, body).pipe(
      map((res) => {
        return res ? res : undefined;
      })
    );
  }

  public setDepositStatus(data: any) {
    this.depositpaymentStatus = data;
  }

  public getDepositStatus(): any {
    return this.depositpaymentStatus;
  }

  public clearDepositStatus() {
    this.depositpaymentStatus = null;
  }
}
