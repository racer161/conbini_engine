import { uniqueId } from "lodash";
import { Entity } from "../core/Entity";
import { System } from "../core/System";
import { PhysicsSystem } from "../impl/Physics";
import { RenderSystem } from "../impl/Renderer";

export class Scene{

    entity_array : Entity[] = [];
    system_array : System<any>[] = [];

    constructor(root : Object){
        this.entity_array = root_to_entity_array(root);
        this.system_array = new Array<System<any>>();
        this.system_array.push(new RenderSystem(this));
        this.system_array.push(new PhysicsSystem(this));
        this.init();
    }

    async init(){
        //call init on all systems
        for(let system of this.system_array){
            await system.init();
        }

    }

    //TODO: make this not a shitty double nested foreach loop
    getEntitiesFromArchetype<T extends Entity>(archetype : string[]) : T[]{
        //for each entity in the array
        return this.entity_array.filter(e => {
            archetype.forEach(component => {
                if(!e.hasOwnProperty(component)){
                    return false;
                }
            })
        }).map(e => e as T);
    }


}

function root_to_entity_array(root : Object) : Entity[]
{
    let entity_array : Entity[] = [];

    //iteratively descend the object tree and create entities and entering .children
    function iterate_object(obj : Entity, parent : Entity){
        const entity : Entity = {
            id : uniqueId(),
            ...obj
        };

        delete entity.children;

        entity_array.push(entity);

        obj.children.forEach(child => iterate_object(child, entity));

    }
    
    return entity_array;
}