import { System } from "../core/System";
import RapierPhysics from '../../include/RapierPhysics';
import { ColliderDesc, RigidBody, RigidBodyDesc } from "@dimforge/rapier3d";
import { TransformComponent } from "../primitives/Transform";
import { Entity } from "../core/Entity";
import { keys } from "ts-transformer-keys";

import { HandComponent, HandType } from "./Hand";
import { XRInputSource, XRSession, WebXRManager, XRFrame, XRHandJoint, XRJointPose, XRHand, XRReferenceSpace, Vector3, Quaternion } from "three";
import { XRSpace } from "webxr";
import { float3 } from "../primitives";
import { transform } from "lodash";
import { ColliderComponent, JointComponent, RigidBodyComponent } from "./Physics";



interface JointEntity extends TransformComponent, HandComponent, RigidBodyComponent, JointComponent{}


interface WebXRFrameHaver{
    getFrame(): XRFrame;
}

export class HandInput<T extends Entity & JointEntity> extends System<T>{

    name: string = "HandInput";

    archetype: string[] = keys<JointEntity>();
    session: XRSession;

    rightHand: XRHand;
    leftHand: XRHand;

    xr_manager: WebXRManager;
    cached_pose: Float32Array;

    init_priority: number = 2;
    run_priority: number = 2;

    async init(): Promise<void>
    {
        const renderer = this.scene.render_system.renderer;
        this.xr_manager = renderer.xr as WebXRManager;
        
    }

    
    async beforeUpdate(time: number, frame?: XRFrame): Promise<void>{
        if(!this.session) this.session = this.scene.render_system.renderer.xr.getSession();
        //TODO: detect hand rebinding after session pause
        if(this.session && (!this.rightHand || !this.leftHand)) this.setHands();
    }

    async update(e: T, time: number, frame?: XRFrame): Promise<void> {
        if(!e.joint_space) return;
        //if(!frame) return;
        const transform_snapshot = frame.getJointPose(e.joint_space, this.xr_manager.getReferenceSpace());
        //if the transform is not valid, don't update it

        
        if(transform_snapshot){
            //e.transform.setFromFloat32Array(transform_snapshot.transform.matrix);
            const pos = new Vector3(transform_snapshot.transform.position.x, transform_snapshot.transform.position.y, transform_snapshot.transform.position.z);
            e.rigidbody.setNextKinematicTranslation(pos);
            //const rot = new Quaternion(transform_snapshot.transform.orientation.x, transform_snapshot.transform.orientation.y, transform_snapshot.transform.orientation.z, transform_snapshot.transform.orientation.w);
            //e.rigidbody.setNextKinematicRotation(rot);
            e.joined_entity.rigidbody.wakeUp();
        } 
        //e.joined_entity.rigidbody.wakeUp();
    }
    
    setHands(){
        if(!this.session.inputSources) return;
        this.session.inputSources.forEach(source => {
            if(source.hand){
                if(source.handedness === 'right'){
                    this.rightHand = source.hand;
                    console.log("right hand: ", source);
                    this.setJointPoses(source.hand, HandType.Right);
                }else{
                    this.leftHand = source.hand;
                    console.log("left hand: ", source);
                    this.setJointPoses(source.hand, HandType.Left);
                }
            }
        });
    }

    setJointPoses(hand : XRHand, hand_type : HandType)
    {
        console.log(`Setting ${hand_type} joint poses`);
        
        this.scene.entities_x_system.get(this.name).forEach((e : JointEntity) => {
            //if the entity is on the same hand as the one we're looking at
            if(e.hand_type === hand_type){
                //set the joint space pointer to the entities pointer
                e.joint_space = hand.get(e.joint_name as unknown as XRHandJoint);
            } 
        })
    }

}

