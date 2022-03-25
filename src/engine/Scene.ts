import { uniqueId } from "lodash";
import { WebGLBufferRenderer, XRFrame } from "three";
import { Entity } from "../core/Entity";
import { System } from "../core/System";
import { HandInput } from "../impl/HandInput";
import { Physics } from "../impl/Physics";
import { RenderEntity, Render } from "../impl/Renderer";

export class Scene{

    //TODO: eventually break this out into its own class that can manage the entities_x_system map as well
    entity_array : Entity[] = [];
    system_array : System<any>[] = [];
    physics_system: any;

    entities_x_system: Map<string, any[]> = new Map();

    render_system: Render<RenderEntity>;

    current_frame_is_processing: boolean;

    constructor(starting_entities : Entity[]){
        this.entity_array = starting_entities;
        
        this.system_array = new Array<System<any>>();

        this.system_array.push(new HandInput(this));
        const render_system = new Render<RenderEntity>(this);
        this.render_system = render_system;
        this.system_array.push(render_system);
        this.system_array.push(new Physics(this));

        this.init();
        console.log(this.entity_array);
    }

    async init(){
        //call init on all systems in the order of the init_priority
        for(let system of this.system_array.sort((a, b) => a.init_priority - b.init_priority)){
            console.log(`Initializing ${system.name}`);
            this.entities_x_system.set(system.name, this.getEntitiesFromArchetype(system.archetype));
            await system.init();
        }

        this.system_array = this.system_array.sort((a, b) => a.run_priority - b.run_priority);

        var self = this;
        //create the update loop
        this.render_system.renderer.setAnimationLoop((time: number, frame: XRFrame) => {
            if(self.current_frame_is_processing) return;
            else self.update(time, frame);
        });

    }

    get_entity_from_id(id : string){
        return this.entity_array.find(e => e.id === id);           
    }

    async update(time: number, frame?: XRFrame){
        this.current_frame_is_processing = true;
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
        this.current_frame_is_processing = false;
    }

    getEntitiesFromArchetype<T>(archetype : string[]) : T[]{
        //for each entity in the array
        return this.entity_array
        .filter((e : Entity) => archetype.every(val => e.hasOwnProperty(val)))
        .map(e => e as unknown as T);
    }


}

