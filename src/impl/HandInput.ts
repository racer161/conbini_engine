import { System } from "../core/System";
import RapierPhysics from '../../include/RapierPhysics';
import { ColliderDesc, RigidBody, RigidBodyDesc } from "@dimforge/rapier3d";
import { PositionComponent } from "./Transform";
import { Entity } from "../core/Entity";
import { keys } from "ts-transformer-keys";

import type { XRHand, XRJointPose } from 'webxr';
import { Group } from "three";

interface HandComponent{
    joint : XRJointPose
}

interface JointEntity extends PositionComponent, HandComponent{}


export class HandInput<T extends Entity & JointEntity> extends System<T>{

    name: string = "HandInput";

    archetype: string[] = keys<JointEntity>();

    //TODO: convert this to a scene XML object that you can just import
    //rather than being hardcoded entity creation here?
    async init(): Promise<void>
    {

        const renderer = this.scene.render_system.renderer;

        const hand0 : Group = renderer.xr.getHand(0);
        const hand1 : Group = renderer.xr.getHand(1);

        console.log(hand0);
        
    }


    async beforeUpdate(): Promise<void>{
        
    }

    async update(e: T): Promise<void> {
        
    }
    

}