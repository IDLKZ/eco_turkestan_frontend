import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {catchError, distinct, map, Observable, shareReplay} from "rxjs";
import {Area} from "../models/Area";
import {Marker} from "../models/Marker";

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  baseApi = environment.baseApiUrl;

  constructor(private http:HttpClient) {

  }

  getAll(ids:number[]):Observable<Marker[]>{
    let params = new HttpParams();

    if(ids.length){
      params = params.append('ids', ids.join(', '));
    }
    return this.http.get<Marker[]>(this.baseApi + "/markers-all-place",{params}).pipe(
      map((response:Marker[])=>{
          return response
        },
        catchError((error)=>{
          return error;
        }),
      ),
      distinct(),
      shareReplay()

    )
  }
}
