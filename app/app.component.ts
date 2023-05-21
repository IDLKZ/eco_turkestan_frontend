import {Component, OnInit} from '@angular/core';
import {latLng, tileLayer, geoJSON, polygon, marker, Layer, icon, Icon} from "leaflet";
import {AreaService} from "../common/services/area.service";
import {Area} from "../common/models/Area";
import {PlaceService} from "../common/services/place.service";
import {Place} from "../common/models/Place";
import {MarkerService} from "../common/services/marker.service";
import {Marker} from "../common/models/Marker";
import {SystemDataService} from "../common/services/system-data.service";
import {SystemData} from "../common/models/SystemData";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'eco_shymkent_front';
  areas:Area[] = [];
  places:Place[] = [];
  makers:Marker[] = [];
  Layer = [];
  //@ts-ignore
  SystemData:SystemData;

  treeIcon = icon({
    iconUrl:"https://png.pngtree.com/png-vector/20221205/ourmid/pngtree-simple-tree-png-image_6506935.png",
    iconSize: [50, 50],
    iconAnchor: [50, 50],
  });


  options = {
    preferCanvas:true,
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 12,
    center: latLng(42.315524, 69.586943)
  };

  ngOnInit(): void {

  }
  constructor(private areaService:AreaService,private placeService:PlaceService,private markerService:MarkerService,private systemService:SystemDataService) {
      this.initializeSystemData();
      this.initializeArea();
      this.initializePlace();
      this.initializeMarker();

  }

  initializeSystemData(){

    this.systemService.getAll().subscribe(
      data=>{
        this.SystemData = data;

        console.log(data);
      }
    );
  }

  initializeArea(){
    this.areaService.getAll().subscribe(
      data=>{
        this.areas = data;
        this.areas.forEach(
          itemArea=>{
            this.AddLayer(itemArea.geocode,itemArea.bg_color,itemArea.title_ru);
          }
        )
      }
    );
  }

  initializePlace(){
    this.placeService.getAll().subscribe(
      data=>{
        this.places = data;
        this.places.forEach(
          itemPlace=>{
            this.AddLayer(itemPlace.geocode,itemPlace.bg_color,itemPlace.title_ru);
          }
        )
      }
    );
  }

  initializeMarker(){
    this.markerService.getAll().subscribe(
      data=>{
        this.makers = data;
        this.makers.forEach(
          itemMarker=>{
            let geocode = (JSON.parse(itemMarker.geocode));
            // @ts-ignore
            this.Layer.push(marker([geocode.lat, geocode.lng ],{icon: this.treeIcon}).on("click",function () {
              console.log(itemMarker);
            }));
          }
        )
      }
    );
  }


  AddLayer(geocode:string,bg_color:string,title_ru:string){
    let data = geoJSON(JSON.parse(geocode));
    data.setStyle({
      color:bg_color
    });
    data.bindTooltip(title_ru, { permanent: true, offset: [0, 12] });
    // @ts-ignore
    this.Layer.push(data);
  }



}


