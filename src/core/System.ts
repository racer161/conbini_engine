import { float3 } from "../primitives";
import { ColliderDesc, RigidBody } from '@dimforge/rapier3d';
import { values } from "lodash";
import { Entity } from "./Entity";
import { Sandbox } from "../engine/Sandbox";


export abstract class System<T> 
{
    scene: Sandbox;

    archetype: string[];

    abstract name: string;

    abstract init(): Promise<void>;

    abstract beforeUpdate(): Promise<void>;

    abstract update(e: T) : Promise<void>;

    constructor(scene: Sandbox){
        this.scene = scene;
    }
}

