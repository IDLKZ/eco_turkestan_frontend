import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {catchError, distinct, map, Observable, shareReplay} from "rxjs";
import {Area} from "../models/Area";
import {Place} from "../models/Place";

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  baseApi = environment.baseApiUrl;
  constructor(private http:HttpClient) {

  }

  getAll(ids:number[]):Observable<Place[]>{

    let params = new HttpParams();

    if(ids.length){
      params = params.append('ids', ids.join(', '));
    }
    return this.http.get<Place[]>(this.baseApi + "/places-by-area",{params}).pipe(
      map((response:Place[])=>{
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
