import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {catchError, distinct, map, Observable, shareReplay} from "rxjs";
import {Place} from "../models/Place";
import {SystemData} from "../models/SystemData";

@Injectable({
  providedIn: 'root'
})
export class SystemDataService {
  baseApi = environment.baseApiUrl;
  constructor(private http:HttpClient) {

  }
  SystemData = new Observable<SystemData>();
  getAll():Observable<SystemData>{
    if(Object.keys(this.SystemData).length){
      return this.SystemData;
    }
    return this.SystemData = this.http.get<SystemData>(this.baseApi + "/get-system-all").pipe(
      map((response:SystemData)=>{
          return response
        },
        catchError((error)=>{
          return error;
        }),
      ),
      distinct(),
      shareReplay()
    );
  }
}
