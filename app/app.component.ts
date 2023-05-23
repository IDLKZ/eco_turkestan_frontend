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
  SystemData:SystemData = null;
  //Interactive array
  activeAreas:number[] = [];
  activePlaces:number[] = [];
  activeMarkers:number[] = [];

  activeFilters:{[key: string]: number[]} = {"event":[],"status":[],"category":[],"sanitary":[],"breed":[]}

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
  }

  initializeSystemData(){
    this.systemService.getAll().subscribe(
      data=>{
        this.SystemData = data;
      }
    );
  }

  initializeArea(){
    this.areaService.getAll().subscribe(
      data=>{
        this.areas = data;
        this.recreateLayer();
      }
    );
  }

  initializePlace(){
    if(this.activeAreas.length){
      this.placeService.getAll(this.activeAreas).subscribe(
        data=>{
          this.places = data;
          this.recreateLayer();
        }
      );
    }
    else{
      this.places = [];
    }

  }

  initializeMarker(){
    if(this.activePlaces.length){
      this.markerService.getAll(this.activePlaces,this.activeFilters).subscribe(
        data=>{
          this.makers = data;
          this.recreateLayer();
        }
      );
    }
    else{
      this.makers = [];
    }

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

  toggleArea(id:number){
    let index = this.activeAreas.indexOf(id)
    index == -1 ? this.activeAreas.push(id) : this.activeAreas.splice(index,1);
    this.initializePlace();
  }

  togglePlaces(id:number){
    let index = this.activePlaces.indexOf(id)
    index == -1 ? this.activePlaces.push(id) : this.activePlaces.splice(index,1);
    this.initializeMarker();
  }

  toggleMarkers(id:number){
    let index = this.activeMarkers.indexOf(id)
    index == -1 ? this.activeMarkers.push(id) : this.activeMarkers.splice(index,1);
    this.recreateLayer();
  }
  toggleFilters(id:number,key:string){
    if(this.activeFilters.hasOwnProperty(key)){
      let index = this.activeFilters[key].indexOf(id)
      index == -1 ? this.activeFilters[key].push(id) : this.activeFilters[key].splice(index,1);
      this.initializeMarker();
    }
  }


  recreateLayer(){
    this.Layer = [];
    this.areas.forEach(
      itemArea=>{
        if(this.activeAreas.indexOf(itemArea.id) != -1){
          this.AddLayer(itemArea.geocode,itemArea.bg_color,itemArea.title_ru);
        }
      }
    )
    this.activePlaces = this.activePlaces.filter(activeItemId =>this.places.some(place => place.id === activeItemId));
    this.places.forEach(
      item=>{
        if(this.activePlaces.indexOf(item.id) != -1){
          this.AddLayer(item.geocode,item.bg_color,item.title_ru);
        }
      }
    )
    this.activeMarkers = this.activeMarkers.filter(activeItemId =>this.makers.some(marker => marker.id === activeItemId));

    this.makers.forEach(
      itemMarker=>{
        if(this.activeMarkers.indexOf(itemMarker.id) != -1){
          let geocode = (JSON.parse(itemMarker.geocode));
          // @ts-ignore
          this.Layer.push(marker([geocode.lat, geocode.lng ]).on("click",function () {
            console.log(itemMarker);
          }));
        }

      }
    )
  }



}


