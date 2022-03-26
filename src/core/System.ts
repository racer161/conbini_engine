import { float3 } from "../primitives";
import { ColliderDesc, RigidBody } from '@dimforge/rapier3d';
import { values } from "lodash";
import { Entity } from "./Entity";
import { Scene } from "./Scene";
import { XRFrame } from "three";


export abstract class System<T> 
{
    scene: Scene;

    init_priority: number = 0;
    run_priority: number = 0;

    archetype: string[];

    abstract name: string;

    abstract init(): Promise<void>;

    abstract beforeUpdate(time: number, frame?: XRFrame): Promise<void>;

    abstract update(e: T, time: number, frame?: XRFrame) : Promise<void>;

    constructor(scene: Scene){
        this.scene = scene;
    }
}

