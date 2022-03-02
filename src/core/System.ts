import { float3 } from "../primitives";
import { ColliderDesc, RigidBody } from '@dimforge/rapier3d';
import { values } from "lodash";
import { Entity } from "./Entity";
import { Scene } from "../engine/Scene";


export abstract class System<T extends Entity> 
{
    scene: Scene;

    abstract archetype: string[];

    abstract init(): Promise<void>;

    abstract beforeUpdate(): Promise<void>;

    abstract update(e: T) : Promise<void>;

    constructor(scene: Scene){
        this.scene = scene;
    }
}

