
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentServicesService {
	Url = 'https://paymentfieldtest.free.beeceptor.com/subscribe/'; // beeceptor Api you can change your Api
  constructor(private http: HttpClient) { }


	getPaymentDetails(token) {  //token create using stripe payment with beeceptor unique id
	  console.log(token,"token get from stripe we send this JSON to API with unique id")
    let URL = this.Url;
		try{
			// var httpOptions = {
			// 	headers: new HttpHeaders({
			// 		'Accept': 'application/json',
			// 		'Content-Type':  'application/json',
			// 		'Authorization':  'Bearer ' + token
			// 	})

			// };
      return this.http.post<any>(URL, token).pipe(map((response: any) => {
      return response;
      }), catchError(err => {
                return of(err);
            }));
		} catch(e) {
			console.log(e,'error')
		}
	
  }
}
