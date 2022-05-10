import { World } from "./World";
import { XRFrame } from "three";

//TODO: break this out into SyncPointSystem and ConcurrentSystem
//Concurrent system should have no beforeUpdate or After update which are blocking sync points
export abstract class System<T> 
{
    world: World;

    run_priority: number = 0;

    init_entity_passes = 1;

    abstract archetype: string[];

    entities : Set<T> = new Set<T>();

    abstract name: string;
    
    init_system?(): Promise<void>;

    async insert_entity(e: T): Promise<void>
    {
        this.entities.add(e);
        if(this.init_entity) await this.init_entity(e);
    }

    init_entity?(e: T): Promise<void>;

    is_of_archetype(e: any): boolean { return this.archetype && this.archetype.every(a => e.hasOwnProperty(a)); }

    beforeUpdate?(delta_time: number, frame?: XRFrame): Promise<void>;

    afterUpdate?(delta_time: number, frame?: XRFrame): Promise<void>;

    //called for each entity in the system each frame
    update?(e: T, delta_time: number, frame?: XRFrame) : Promise<void>;

    async run_update(delta_time: number, frame?: XRFrame ) : Promise<void>
    {
        //allow the system to do preprocessing
        if(this.beforeUpdate) await this.beforeUpdate(delta_time, frame);

        //for each entity process the update 
        //this has to be handled at the top world level to enable parallism?
        
        //DESIGN: I think this can be scheduled all in one chunk like this on a separate thread
        //the world just needs to check if all write-to resources are not being written to by other systems
        if(this.update) await Promise.all(
            [...this.entities].map(async e => {
                return this.update(e, delta_time, frame);
            }
        ));

        if(this.afterUpdate) await this.afterUpdate(delta_time, frame);
    }

    //onCollision?(e: T, other: RigidbodyEntity, state : CollisionState, manifold: TempContactManifold, flipped : boolean ): void;

    constructor(world: World){
        this.world = world;
    }
}

export abstract class SingletonSystem<T> extends System<T>
{
    entity : T;
    entities : Set<T> = undefined;
    archetype: string[] = undefined;

    async run_update(delta_time: number, frame?: XRFrame): Promise<void> {
        if(this.beforeUpdate) await this.beforeUpdate(delta_time, frame);
        if(this.update) await this.update(this.entity, delta_time, frame);
        if(this.afterUpdate) await this.afterUpdate(delta_time, frame);
    }
}

