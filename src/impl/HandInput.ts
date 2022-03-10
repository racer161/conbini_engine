import { System } from "../core/System";
import RapierPhysics from '../../include/RapierPhysics';
import { ColliderDesc, RigidBody, RigidBodyDesc } from "@dimforge/rapier3d";
import { PositionComponent } from "./Transform";
import { Entity } from "../core/Entity";
import { keys } from "ts-transformer-keys";

import { HandComponent } from "./Hand";
import { XRInputSource, XRSession, WebXRManager, XRFrame, XRHandJoint, XRJointPose } from "three";



interface JointEntity extends PositionComponent, HandComponent{}


interface WebXRFrameHaver{
    getFrame(): XRFrame;
}

export class HandInput<T extends Entity & JointEntity> extends System<T>{

    name: string = "HandInput";

    archetype: string[] = keys<JointEntity>();
    session: XRSession;

    rightHand: XRInputSource;
    leftHand: XRInputSource;

    xr_manager: WebXRManager & WebXRFrameHaver;
    cached_pose: Float32Array;

    //TODO: convert this to a scene XML object that you can just import
    //rather than being hardcoded entity creation here?
    async init(): Promise<void>
    {

        const renderer = this.scene.render_system.renderer;
        this.xr_manager = renderer.xr as WebXRManager & WebXRFrameHaver;
        
        
    }

    
    async beforeUpdate(time: number, frame?: XRFrame): Promise<void>{
        if(!this.session) this.session = this.scene.render_system.renderer.xr.getSession();
        if(this.session && (!this.rightHand || !this.leftHand)) this.setHands();

        const referenceSpace = this.xr_manager.getReferenceSpace();
        
        if(this.leftHand){
            let indexFingerTipJoint = this.leftHand.hand.get("index-finger-tip" as unknown as XRHandJoint);
            const pose = frame.getJointPose(indexFingerTipJoint, referenceSpace); // XRJointPose
            if(pose){
                this.cached_pose = pose.transform.matrix;
            }
        }
        
        console.log(this.cached_pose.at(4));
    }

    async update(e: T): Promise<void> {
        
    }
    
    setHands(){
        
        this.session.inputSources.forEach(source => {
            if(source.hand){
                if(source.handedness === 'right'){
                    this.rightHand = source;
                    console.log("right hand: ", source);
                }else{
                    this.leftHand = source;
                    console.log("left hand: ", source);

                }
            }
        });
    }

}

