import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = environment.apiBaseUrl + '/api/address';


  constructor(
    private http: HttpClient

  ) { }


  getProfileById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getByIdAddress/${id}`);
  }
  
  getAddressesByProfileId(profileId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAddressesByProfileId/${profileId}`);
  }

}
