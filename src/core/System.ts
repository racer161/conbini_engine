import { float3 } from "../primitives";
import { ColliderDesc, RigidBody } from '@dimforge/rapier3d';
import { values } from "lodash";
import { Entity } from "./Entity";
import { Sandbox } from "../engine/Sandbox";
import { XRFrame } from "three";


export abstract class System<T> 
{
    scene: Sandbox;

    archetype: string[];

    abstract name: string;

    abstract init(): Promise<void>;

    abstract beforeUpdate(time: number, frame?: XRFrame): Promise<void>;

    abstract update(e: T, time: number, frame?: XRFrame) : Promise<void>;

    constructor(scene: Sandbox){
        this.scene = scene;
    }
}

