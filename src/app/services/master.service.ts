import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private http:HttpClient) { }

  getDataSources(): Observable<any[]> {
    return this.http.get<any[]>('./assets/data/datasources.json')
  }
  getData(): Observable<any[]> {
    return this.http.get<any[]>('./assets/data/data.json')
  }
}
