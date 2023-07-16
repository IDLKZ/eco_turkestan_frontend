import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {latLng, tileLayer, geoJSON, polygon, marker, Layer, icon, Icon, LeafletMouseEvent, IconOptions} from "leaflet";
import {AreaService} from "../common/services/area.service";
import {Area} from "../common/models/Area";
import {PlaceService} from "../common/services/place.service";
import {Place} from "../common/models/Place";
import {MarkerService} from "../common/services/marker.service";
import {Marker} from "../common/models/Marker";
import {SystemDataService} from "../common/services/system-data.service";
import {SystemData} from "../common/models/SystemData";
import {NgxSmartModalService} from "ngx-smart-modal";
import {environment} from "../environments/environment";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  maxZoom:number = 18;
  title = 'eco_shymkent_front';
  areas:Area[] = [];
  places:Place[] = [];
  makers:Marker[] = [];
  Layer = [];
  //@ts-ignore
  SystemData:SystemData;
  //Interactive array
  activeAreas:number[] = [];
  activePlaces:number[] = [];
  activeFilters:{[key: string]: number[]} = {"event":[],"status":[],"category":[],"sanitary":[],"breed":[],"type":[]}
  actualLayer = [];
  event_filter:number[] = [];
  status_filter:number[] = [];
  category_filter:number[] = [];
  sanitary_filter:number[] = [];
  breed_filter:number[] = [];
  type_filter:number[] = [];
  search_polygon:string = "";
  treeIcon = icon({
    iconUrl:"https://dpbh.ucla.edu/wp-content/uploads/2021/10/tree_icon.png",
    iconSize: [25, 25],
    iconAnchor: [25, 25],
  });
  //@ts-ignore
  activeMarker:Marker;
  selectedTreeIcon = icon({
    iconUrl:"https://cdn-icons-png.flaticon.com/512/148/148767.png",
    iconSize: [25, 25],
    iconAnchor: [25, 25],
  });
  selectedMarker:any = null;
  baseApiImage = environment.baseUrlImage;
  options = {
    preferCanvas:true,
    layers: [
      tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',  {subdomains:['mt0','mt1','mt2','mt3'], maxZoom: 21, maxNativeZoom: 20, attribution: '...' })
    ],
    zoom: 12,
    center: latLng(43.300777, 68.321683),
  };
  MULTI_SELECT_CONFIG: any = Object.assign({}, {
    highlight: false,
    create: false,
    persist: true,
    plugins: ['dropdown_direction', 'remove_button'],
    dropdownDirection: 'down'
  }, {
    labelField: 'title_ru',
    valueField: 'id',
    searchField: ['title_ru'],
    maxItems: 50
  });
  baseBreedsImage = environment.baseBreedsImage;
  ngOnInit(): void {

  }
  constructor(public ngxSmartModalService: NgxSmartModalService,private areaService:AreaService,private placeService:PlaceService,private markerService:MarkerService,private systemService:SystemDataService) {
    this.initializeSystemData();
    this.initializeArea();
  }
  onZoom($event:any){
    let actualZoom = $event.target.getZoom();
    this.Layer = Array.from(this.actualLayer);
    if(actualZoom >= this.maxZoom){
      let bounds = $event.target.getBounds();
      let search_polygon = polygon([
        bounds._southWest,
        latLng(bounds._northEast.lat, bounds._southWest.lng), // Top-left coordinate
        bounds._northEast,
        latLng(bounds._southWest.lat, bounds._northEast.lng)
      ]);
      //@ts-ignore
      this.search_polygon = JSON.stringify(search_polygon.toGeoJSON());
      this.initializeMarker();

    }
    else{
      this.makers = [];
      this.Layer = Array.from(this.actualLayer);
    }



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
    this.placeService.getAll(this.activeAreas).subscribe(
      data=>{
        this.places = data;
        this.activePlaces = this.activePlaces.filter(activeItemId =>this.places.some(place => place.id === activeItemId));
        this.recreateLayer();
      }
    );
  }

  initializeMarker(){
    if(this.activePlaces.length){
      this.markerService.getAll(this.activePlaces,this.search_polygon,this.activeFilters).subscribe(
        data=>{
          this.makers = data;
          this.makers.forEach(
            itemMarker=>{
              let geocode = (JSON.parse(itemMarker.geocode));
              // @ts-ignore
              this.Layer.push(marker([geocode.lat, geocode.lng ],{icon:this.getTreeIcon(itemMarker.sanitary_id,itemMarker.type_id)}).on("click",(e)=>this.clickFeauturePoint(e,itemMarker)));
            }
          )
        }
      );
    }
  }





  AddLayer(geocode:string,bg_color:string,title_ru:string){
    let data = geoJSON(
      JSON.parse(geocode)
    );
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
    this.recreateLayer();
  }

  getBreedImage(id:number){
    try{
      // @ts-ignore
      let element = this.SystemData["breed"].find(item=>item.id == id);
      if(element){
        return this.baseBreedsImage + element.image_url;
      }
      return "https://obuchonok.ru/files/images/derevo.jpg";
    }
    catch (e) {
      return "https://obuchonok.ru/files/images/derevo.jpg";
    }
  }

  getLatLng(geocode:string):string{
    try{
      let latlng = JSON.parse(geocode);
      return `Широта ${latlng.lat}, Долгота ${latlng.lng}.`
    }
    catch (e) {
      return "-"
    }

  }

  recreateLayer(){
    this.Layer = [];
    if(this.activeAreas.length > 0){
      this.areas.forEach(
        itemArea=>{
          if(this.activeAreas.indexOf(itemArea.id) != -1){
            this.AddLayer(itemArea.geocode,itemArea.bg_color,itemArea.title_ru);
          }
        }
      )
      this.places.forEach(
        item=>{
          if(this.activePlaces.indexOf(item.id) != -1 && this.activeAreas.includes(item.area_id)){
            this.AddLayer(item.geocode,item.bg_color,item.title_ru);
          }
        }
      )
      this.actualLayer = this.Layer;
    }
  }

  clickFeauturePoint(e:LeafletMouseEvent,item:Marker){
    if (this.selectedMarker) {
      // Revert the icon of the previously clicked marker
      this.selectedMarker.setIcon(this.getTreeIcon(item.sanitary_id,item.type_id));
    }
    // Change the icon of the clicked marker
    e.target.setIcon(this.selectedTreeIcon);
    // Store the reference to the currently clicked marker
    this.selectedMarker =  e.target;
    this.activeMarker = item;
    this.ngxSmartModalService.getModal('myModal').open()
  }






  toggleFilters(){
    this.Layer = Array.from(this.actualLayer);
    this.activeFilters = {"event":this.event_filter,"status":this.status_filter,"category":this.category_filter,"sanitary":this.sanitary_filter,"breed":this.breed_filter,"type":this.type_filter}
    this.initializeMarker();
  }

  getTitle(property:string,id:number){
    try{
      // @ts-ignore
      let element = this.SystemData[property].find(item=>item.id == id);
      return element.title_ru;
    }
    catch (e) {
      return "Неизвестно";
    }
  }

  getTreeIcon(sanitary_id:number|null,type_id:number|null):Icon<IconOptions>{
    if(this.SystemData.sanitary){
      var img = "https://dpbh.ucla.edu/wp-content/uploads/2021/10/tree_icon.png";
      if(this.SystemData.sanitary_type.length){
        var icons = this.SystemData.sanitary_type.find(item => item.sanitary_id == sanitary_id && item.type_id == type_id);
        if(icons != null){
          img = this.baseApiImage + icons.image_url;
        }
      }


      return icon({
        iconUrl:img,
        iconSize: [25, 25],
        iconAnchor: [25, 25],
      });
    }
    return icon({
      iconUrl:"https://dpbh.ucla.edu/wp-content/uploads/2021/10/tree_icon.png",
      iconSize: [25, 25],
      iconAnchor: [25, 25],
    });

  }



}




