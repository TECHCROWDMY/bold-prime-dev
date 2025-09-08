import { Injectable, Inject } from '@angular/core';
import { API } from '../constants/constant'; // Adjust the path accordingly
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private res: any;

  constructor(@Inject(ApiService) private apiService: ApiService) {}

  getUserPermission(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.callApiGetRequest(API.PROFILE, {}).subscribe(
        (response: any) => {
          if (response) {
            console.log(response, 5552);
            this.res = response;
            localStorage.setItem('boldUserDetail', JSON.stringify(response));
            resolve(response);
          } else {
            reject('No response data');
          }
        },
        (err: any) => {
          console.error(err);
          reject(err);
        }
      );
    });
  }

  getUserAccess(accessName: string): any {
    const result = this.res?.financialPermissions?.find(
      (x: any) => x === accessName
    );
    console.log(this.res.financialPermissions, 5552);
    return result;
  }
}

export default UserService;
