import { float3 } from "../primitives";
import { ColliderDesc, RigidBody } from '@dimforge/rapier3d';
import { values } from "lodash";
import { Entity } from "./Entity";
import { World } from "./World";
import { XRFrame } from "three";


export abstract class System<T> 
{
    //TODO: eventually add a component array manager for only the components stored in the archetype

    world: World;

    init_priority: number = 0;
    run_priority: number = 0;

    init_entity_passes = 1;

    archetype: string[];

    entities : T[] = [];

    abstract name: string;

    
    abstract init_system(): Promise<void>;

    init_entity?(e: T, pass : number): Promise<void>;


    beforeUpdate?(time: number, frame?: XRFrame): Promise<void>;

    afterUpdate?(time: number, frame?: XRFrame): Promise<void>;

    abstract update(e: T, time: number, frame?: XRFrame) : Promise<void>;

    onCollisionFirstFrame?(e: T, other: Entity): void;

    onCollisionContinues?(e: T, other: Entity): void;

    onCollisionLastFrame?(e: T, other: Entity): void;



    constructor(world: World){
        this.world = world;
    }
}

