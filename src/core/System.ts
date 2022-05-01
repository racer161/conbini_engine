import { float3 } from "../primitives";
import { ColliderDesc, RigidBody, TempContactManifold } from '@dimforge/rapier3d';
import { values } from "lodash";
import { Entity } from "./Entity";
import { World } from "./World";
import { XRFrame } from "three";
import { CollisionState } from "../impl/Collision";
import { Physics, PhysicsEntity } from "../impl/Physics";

//TODO: eventually implement component arrays at the top level of world
//It should be a auto-detect system based on the primitive data types
//that gathers all the entitiy values and exhanges their data for a reference in the array
//everything else should be left alone
//why the top level?
//So the async scheduler can schedule the ownership of the arrays accross parallel system threads
export abstract class System<T> 
{
    world: World;

    run_priority: number = 0;

    init_entity_passes = 1;

    archetype: string[];

    entities : Set<T> = new Set<T>();

    abstract name: string;
    
    init_system?(): Promise<void>;

    init_entity?(e: T, pass : number): Promise<void>;

    beforeUpdate?(time: number, frame?: XRFrame): Promise<void>;

    afterUpdate?(time: number, frame?: XRFrame): Promise<void>;

    //called for each entity in the system each frame
    abstract update(e: T, time: number, frame?: XRFrame) : Promise<void>;

    async run_update(time: number, frame?: XRFrame) : Promise<void>
    {
        //allow the system to do preprocessing
        if(this.beforeUpdate) await this.beforeUpdate(time, frame);

        //for each entity process the update 
        //this has to be handled at the top world level to enable parallism?
        await Promise.all(
            [...this.entities].map(async e => {
                return this.update(e, time, frame);
            }
        ));
    }

    //onCollision?(e: T, other: PhysicsEntity, state : CollisionState, manifold: TempContactManifold, flipped : boolean ): void;

    constructor(world: World){
        this.world = world;
    }
}

