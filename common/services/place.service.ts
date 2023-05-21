import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
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

  getAll():Observable<Place[]>{
    return this.http.get<Place[]>(this.baseApi + "/places-all").pipe(
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
