import {Type} from "./Type";
import {Breed} from "./Breed";
import {Status} from "./Status";
import {Sanitary} from "./Sanitary";
import {Category} from "./Category";
import {Place} from "./Place";

export interface Marker {
  id: number
  user_id: number
  type_id: number
  event_id: number
  sanitary_id: number
  category_id: number
  breed_id: number
  status_id: number
  place_id: number
  geocode: string
  image_url: any
  age: string
  height: string
  diameter: string
  landing_date: string
  created_at: string
  updated_at: string
  event: Event
  type: Type
  breed: Breed
  sanitary: Sanitary
  status: Status
  category: Category
  place: Place
}
