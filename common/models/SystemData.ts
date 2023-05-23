import { Breed } from "./Breed"
import {Category} from "./Category";
import {Sanitary} from "./Sanitary";
import {Status} from "./Status";
import {Type} from "./Type";
import {Event} from "./Event";

export interface SystemData {
  breed: Breed[]
  category: Category[]
  event: Event[]
  sanitary: Sanitary[]
  status: Status[]
  type: Type[]
}
