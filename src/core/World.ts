import { uniqueId } from "lodash";
import { WebGLBufferRenderer, XRFrame } from "three";
import { Entity } from "./Entity";
import { System } from "./System";
import { HandInput } from "../impl/HandInput";
import { Physics } from "../impl/Physics";
import { RenderEntity, Render } from "../impl/Renderer";

export class World{

    entity_array : Entity[] = [];
    system_array : System<any>[] = [];

    collision_listeners : System<any>[] = [];

    current_frame_is_processing: boolean;

    constructor(get_system_array : (world : World) => System<any>[]){
        this.system_array = get_system_array(this);
    }

    async init(starting_entities : Entity[]){

        //INIT_SYSTEM
        for(let system of this.system_array.sort((a, b) => a.init_priority - b.init_priority)){
            console.log(`Initializing ${system.name}`);
            await system.init_system();
        }

        //INSERT STARTING ENTITIES
        for(let e of starting_entities){
            this.insert_entity(e);
        }

        const max_passes = this.system_array.reduce((acc, s) => Math.max(acc, s.init_entity_passes), 0);
        console.log(`Max passes: ${max_passes}`);

        //INIT_ENTITY
        //TODO: init when inserting a new entity after engine start?
        for(let pass = 1; pass <= max_passes; pass++){
            console.log(`Initializing entities pass ${pass}`);
            //sort by init priority
            for(let system of this.system_array.sort((a, b) => a.init_priority - b.init_priority)){
                //this system has already been through all its passes so skip it
                if(pass > system.init_entity_passes || !system.init_entity) continue;
                //otherwise process the init entity again
                for(let e of system.entities){
                    await system.init_entity(e, pass);
                }
            }
        }

        //ORDER THE SYSTEMS BY run_priority
        this.system_array = this.system_array.sort((a, b) => a.run_priority - b.run_priority);
        

        var self = this;
        const render_system = this.system_array.find(s => s instanceof Render) as Render<RenderEntity>;

        //START THE ENGINE LOOP
        render_system.renderer.setAnimationLoop((time: number, frame: XRFrame) => {
            if(self.current_frame_is_processing) return;
            else self.update(time, frame);
        });

    }

    //THIS FUNCTION DOES NOT INITIALIZE ENTITIES IT ONLY INSERTS THEM TO THE DATA STRUCTURES
    insert_entity(e : Entity){
        //add it to the global array
        this.entity_array.push(e);

        //add it to the systems
        for(let system of this.system_array){
            if(system.archetype.every(a => e.hasOwnProperty(a))){
                system.entities.push(e);
            }
        }
    }

    private async update(time: number, frame?: XRFrame){
        this.current_frame_is_processing = true;
        for(let system of this.system_array){
            //allow the system to do preprocessing
            await system.beforeUpdate(time, frame);

            //for each entity process the update 
            //this has to be handled at the top world level to enable parallism?
            await Promise.all(
                system.entities.map(async e => {
                    return system.update(e, time, frame);
                }
            ));
        }

        this.current_frame_is_processing = false;
    }
}
