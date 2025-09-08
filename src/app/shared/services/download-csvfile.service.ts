import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DownloadCSVFileService {

  bodyData: any = {
    from: "2021-04-26T04:53:14.202Z",
    to: "2023-04-26T04:53:14.202Z",
    currency: "USD",
    tableConfig: {
      filters: [
        {
          field: "",
          modificator: "",
          value: ""
        }
      ],
      segment: {
        limit: "1000",
        offset: 0
      },
      sorting: {
        field: '',
        direction: ''
      },
      withTotals: true,
      csv: true
    }
  }

  constructor(private httpClient: HttpClient) { }

  downloadFile(ApiNameExport: any, body: any) {
    return this.httpClient.post(ApiNameExport, body,
      { observe: 'response', responseType: 'blob' })
  }
}
