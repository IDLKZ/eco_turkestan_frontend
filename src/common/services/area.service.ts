import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {catchError, distinct, map, Observable, shareReplay} from "rxjs";
import {Area} from "../models/Area";

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  baseApi = environment.baseApiUrl;

  constructor(private http:HttpClient) {

  }

  getAll():Observable<Area[]>{
    return this.http.get<Area[]>(this.baseApi + "/areas-all").pipe(
      map((response:Area[])=>{
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
