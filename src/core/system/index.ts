import { float3, TypedArray } from "../../primitives";
import { ComponentArray } from "../component/array";


//TODO: We need an interface to track the availible components and the components on an entity
//TODO: make this completely data driven instead of using a classs
//using interfaces?
export interface Entity
{
    id: string;
}

export abstract class System<T extends Entity> 
{
    abstract init(): Promise<void>;

    //User implemented type guard to determine which entities will be passed to update
    abstract criteria(e: Entity) : e is T;

    abstract update(e: T) : Promise<void>;
}