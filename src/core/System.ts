import { float3 } from "../primitives";
import { ColliderDesc, RigidBody } from '@dimforge/rapier3d';
import { values } from "lodash";
import { Entity } from "./Entity";
import { World } from "./World";
import { XRFrame } from "three";


export abstract class System<T> 
{
    world: World;

    init_priority: number = 0;
    run_priority: number = 0;

    archetype: string[];

    abstract name: string;

    //TODO: break this into init_system and init_entity
    abstract init(): Promise<void>;

    abstract beforeUpdate(time: number, frame?: XRFrame): Promise<void>;

    abstract update(e: T, time: number, frame?: XRFrame) : Promise<void>;

    abstract onCollision(e: T, other: Entity): void;

    constructor(world: World){
        this.world = world;
    }
}

