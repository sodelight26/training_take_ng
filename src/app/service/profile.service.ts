import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { count, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = environment.apiBaseUrl + '/api/profile';

  constructor(
    private http: HttpClient
  ) { }

  getAllProfiles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getAllProfile`);
  }

  getProfileAndAddressById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getProfileAndAddresses/id=${id}`);
  }

  
  saveProfileAndAddress(formData: any) {
    return this.http.post<any>(`${this.apiUrl}/postProfileAndAddress`, formData,{responseType:'text' as 'json'});
  }
  
  updateProfileAndAddress(formData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateProfileAndAddress/id=${formData.id}`, formData,{ responseType: 'text' as 'json' });
  }
 
  deleteProfileAndAddress(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteProfileAndAddress/id=${id}`,{ responseType: 'text' as 'json' });
  }
  
  deleteAddress(addressId: number): Observable <any> {
    return this.http.delete(`${this.apiUrl}/deleteAddress/id=${addressId}`,{ responseType: 'text' as 'json' })

  }

  public serchGetProfile(keyword: string, page: number, size: number) {
    const currentPage = page -1
    if (keyword === undefined || keyword == null) {
      keyword = ''
    }
    const body = {
      keyword: keyword
    }
    console.log('body',body);
    
    const url = `${this.apiUrl}/profile?page-${currentPage}&size=${size}`;
    return this.http.post<any>(url,body);

  }


}


