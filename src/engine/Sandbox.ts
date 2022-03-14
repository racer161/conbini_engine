import { uniqueId } from "lodash";
import { WebGLBufferRenderer, XRFrame } from "three";
import { Entity } from "../core/Entity";
import { System } from "../core/System";
import { HandInput } from "../impl/HandInput";
import { Physics } from "../impl/Physics";
import { RenderEntity, Render } from "../impl/Renderer";

export class Sandbox{

    //TODO: eventually break this out into its own class that can manage the entities_x_system map as well
    entity_array : Entity[] = [];
    system_array : System<any>[] = [];
    physics_system: any;

    entities_x_system: Map<string, any[]> = new Map();

    render_system: Render<RenderEntity>;

    constructor(root : Entity){
        this.entity_array = root_to_entity_array(root);
        
        this.system_array = new Array<System<any>>();

        const render_system = new Render<RenderEntity>(this);
        this.render_system = render_system;
        this.system_array.push(render_system);
        this.system_array.push(new Physics(this));


        //this.system_array.push(new HandInput(this));
        this.init();
        console.log(this.entity_array);
    }

    async init(){
        //call init on all systems
        for(let system of this.system_array){
            console.log(`Initializing ${system.name}`);
            this.entities_x_system.set(system.name, this.getEntitiesFromArchetype(system.archetype));
            await system.init();
        }

        var self = this;
        //create the update loop
        this.render_system.renderer.setAnimationLoop(async (time: number, frame?: XRFrame) => await self.update(time, frame));

    }

    async update(time: number, frame?: XRFrame){
        for(let system of this.system_array){
            //allow the system to do preprocessing
            await system.beforeUpdate(time, frame);

            //for each entity process the update 
            await Promise.all(
                this.entities_x_system.get(system.name).map(async e => {
                    return system.update(e, time, frame);
                }
            ));
        }
    }

    getEntitiesFromArchetype<T>(archetype : string[]) : T[]{
        //for each entity in the array
        //console.log(`archetype :  ${archetype}`);
        return this.entity_array
        .filter((e : Entity) => archetype.every(val => e.hasOwnProperty(val)))
        .map(e => e as unknown as T);
    }


}

function root_to_entity_array(root : Entity) : Entity[]
{
    let entity_array : Entity[] = [];

    //iteratively descend the object tree and create entities and entering .children
    function iterate_object(obj : Entity){

        //delete entity.children;
        if(obj.children) obj.children.forEach(child => iterate_object(child));

        delete obj.children;

        entity_array.push({
            id : uniqueId(),
            ...obj
        });
    }
    
    root.children.forEach(child => iterate_object(child));

    return entity_array;
}