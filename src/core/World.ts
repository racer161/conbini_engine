import { Clock, PerspectiveCamera, XRFrame } from "three";
import { Entity } from "./Entity";
import { System } from "./System";
import { RenderEntity, Render } from "../impl/Renderer";
import { ParentEntity } from "../impl/Transformation";


//TODO: view the order of execution as on big functional chain and entity has to be run through
//Make sure the async scheduler knows that entities should be scheduled independently (in paralell) in one big chain of system updates
//BLIT duplicate entity array to avoid mutation of read only data?

//DESIGN: THE sync point is the main thread but each update should run on its own web worker thread
export class World{

    entity_array : Entity[] = [];
    system_array : System<any>[] = [];

    collision_listeners : System<any>[] = [];

    current_frame_is_processing: boolean;
    clock : Clock = new Clock();

    constructor(get_system_array : (world : World) => System<any>[]){
        this.system_array = get_system_array(this);
    }

    async init(starting_entities : Entity[]){

        //INIT_SYSTEM
        for(let system of this.system_array){
            console.log(`Initializing ${system.name}`);
            if(system.init_system) await system.init_system();
        }

        //INSERT STARTING ENTITIES
        for(let e of starting_entities){
            //if the entity has children descend and add those to the Array as well
            Entity.inOrderTreeTraversal(e as unknown as Entity & ParentEntity, (e : Entity & ParentEntity) => 
            { 
                //add it to the global array
                this.entity_array.push(e);

                //add it to the systems
                for(let system of this.system_array){
                    if(system.is_of_archetype(e)) system.insert_entity(e);
                }
            } );
        }

        //ORDER THE SYSTEMS BY run_priority
        this.system_array = this.system_array.sort((a, b) => a.run_priority - b.run_priority);
        
        console.log(this.entity_array);
        //START THE ENGINE LOOP
        var self = this;
        const render_system = this.system_array.find(s => s instanceof Render) as Render<RenderEntity>;
        
        render_system.renderer.setAnimationLoop((time: number, frame: XRFrame) => {
            if(self.current_frame_is_processing) return;
            else self.update(this.clock.getDelta(), frame);
        });

    }

    private async update(delta_time: number, frame?: XRFrame){
        this.current_frame_is_processing = true;

        //right now this schedules all updates synchronously
        //but eventually these should be moved to separate threads and scheduled asynchronously
        for(let system of this.system_array){
            await system.run_update(delta_time, frame);
        }

        //LIFE HACK: if you only want to process the first frame of the frame loop for debugging you can comment this line out
        this.current_frame_is_processing = false;
    }

    getEntityByName(name : string){
        return this.entity_array.find(e => e.name === name);
    }

    getEntitiesByName(names : string[]){
        return this.entity_array.filter(e => names.includes(e.name));
    }
}

