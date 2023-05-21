import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
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

  getAll():Observable<Marker[]>{
    return this.http.get<Marker[]>(this.baseApi + "/markers-all").pipe(
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
