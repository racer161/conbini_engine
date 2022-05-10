import { XRFrame } from "three";
import { keys } from "ts-transformer-keys";
import { Entity } from "../core/Entity";
import { System } from "../core/System";
import { World } from "../core/World";
import { Transform } from "../primitives/Transform";

//for top level items that just have a transform DO NOTHING
export interface TransformComponent{
    transform : Transform;
}

//children have this component
export interface LocalTransformComponent
{
    local_transform : Transform;
}

//If an object doesn't have a parent then there's no need to run this system on it
//so start by putting this component on the top level object
//then traverse the tree in order
export interface ParentComponent
{
    children : Array<TransformComponent & LocalTransformComponent & Entity>;
    needs_transform_update : boolean;
}

export interface ParentEntity extends TransformComponent, ParentComponent{}

export class Transformation<T extends ParentEntity> extends System<T>
{
    //this array only holds the top level entities which will start the recursion
    entities: Set<T> = new Set<T>();

    name: string = "Transformation";

    //The top level parent entities are those that have children but no local_transform signifying they have no parent
    //therefore the ParentEntity Archetype only delivers the top level entities
    archetype: string[] = keys<ParentEntity>();

    run_priority: number = 1000000000;

    async init_entity(e: T & { local_transform?: Transform }): Promise<void> {
        if(e.local_transform) this.entities.delete(e);
    }
  
    async update(e: ParentEntity, delta_time: number, frame?: XRFrame): Promise<void> 
    {
        this.inOrderTraversal(e);
    }

    inOrderTraversal(e: ParentEntity & { local_transform?: Transform}, parent?: TransformComponent & ParentComponent)
    {
        if(parent && parent.needs_transform_update){
            e.transform.multiply(parent.transform, e.local_transform);
            //console.log(`updated ${(e as unknown as Entity).name} to `,e.transform.translation);
            parent.needs_transform_update = false;
        }

        e.children.forEach((child : TransformComponent & LocalTransformComponent & { children ? : Array<TransformComponent & LocalTransformComponent>})=> {
            this.inOrderTraversal(child as TransformComponent & LocalTransformComponent & ParentComponent, e);
        });
    }
}