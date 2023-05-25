import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {catchError, delay, distinct, map, Observable, shareReplay} from "rxjs";
import {Area} from "../models/Area";
import {Marker} from "../models/Marker";

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  baseApi = environment.baseApiUrl;

  constructor(private http:HttpClient) {

  }

  getAll(ids:number[],search_polygon:string,filters:{[key: string]: number[]}):Observable<Marker[]>{
    let params = new HttpParams();
    let filtersTags = ["event","status","category","sanitary","breed"];

    if(ids.length){
      params = params.append('ids', ids.join(', '));
    }
    if(search_polygon){
      params = params.append('search_polygon', search_polygon);
    }
    filtersTags.forEach((filter)=>{
      if(filters.hasOwnProperty(filter)){
        if(filters[filter].length){
          params = params.append(filter, filters[filter].join(', '));
        }
      }
    });

    return this.http.get<Marker[]>(this.baseApi + "/markers-all-place",{params}).pipe(
      map((response:Marker[])=>{
          return response
        },
        catchError((error)=>{
          return error;
        }),
      ),
      distinct(),
      shareReplay(),

    )
  }
}
