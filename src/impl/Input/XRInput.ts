import { System } from "../../core/System";
import { TransformComponent } from "../Transformation";
import { Entity } from "../../core/Entity";
import { keys } from "ts-transformer-keys";

import { XRInputSource, XRSession, WebXRManager, XRFrame, XRHandJoint, XRJointPose, XRHand, XRReferenceSpace, Vector3, XRJointSpace, XREventType, Camera } from "three";
import { Render, RenderEntity } from "../Renderer";
import { RigidbodyEntity } from "../Physics";
import { float3 } from "../../primitives";
import { Quaternion } from "../../primitives/Quaternion";
import { OculusTouchGamepadInput } from "./XRGamepad";
import { Transform } from "../../primitives/Transform";
import { RigidBody } from "@dimforge/rapier3d";

export interface TrackedPointComponent{
    point_name : string,
    joint_space : XRJointSpace,
    isHand : boolean,
    handedness : Handedness
}

export enum Handedness
{
    Left = 'left',
    Right = 'right'
}

export interface XRTrackedEntity extends TransformComponent, TrackedPointComponent{}


//TODO: break this into multiple systems
//HAND TRACKING
//CONTROLLER TRACKING
//XR GAMEPAD
export class XRInput<T extends Entity & XRTrackedEntity> extends System<T>{
    name: string = "HandInput";

    archetype: string[] = keys<XRTrackedEntity>();
    session: XRSession;

    //TODO: automatically swap these from hands to controllers and back
    //TODO: add full body tracking here
    rightHand: XRHand | EventTarget;
    leftHand: XRHand | EventTarget;

    handTrackingActive: boolean = false;

    gamepad: OculusTouchGamepadInput = new OculusTouchGamepadInput();

    //rightGripSpace: XRGripSpace;

    xr_manager: WebXRManager;

    run_priority: number = 2;
    physics_world: any;
    
    hmd_transform: Transform;
    renderer: Render<RenderEntity>;

    async init_system(): Promise<void>
    {
        this.renderer = this.world.system_array.find(s => s instanceof Render) as Render<RenderEntity>;
        this.xr_manager = this.renderer.renderer.xr as WebXRManager;    

        this.hmd_transform = Transform.identity;
        //this.xr_manager.getCamera(renderer.camera).position.set(0,0,0);
    }

    
    async beforeUpdate(delta_time: number, frame?: XRFrame): Promise<void>{
        if(!this.session) this.session = this.xr_manager.getSession();
        //TODO: detect hand rebinding after session pause
        if(this.session && (!this.rightHand || !this.leftHand)) this.setTrackedPoints();

        //this.hmd_transform.copyFloat32Array(frame.getViewerPose( this.xr_manager.getReferenceSpace()).transform.matrix);
    }

    async update(e: T & { rigidbody?: RigidBody, joined_entity?: RigidbodyEntity, needs_transform_update?: boolean }, delta_time: number, frame?: XRFrame): Promise<void> {
        if(!e.joint_space || (e.isHand && !this.handTrackingActive)) return;
        const transform_snapshot = e.isHand? frame.getJointPose(e.joint_space, this.xr_manager.getReferenceSpace()) : frame.getPose(e.joint_space, this.xr_manager.getReferenceSpace());
        

        //if the transform is not valid, don't update it
        if(transform_snapshot){
            e.transform.translation = new float3(transform_snapshot.transform.position.x, transform_snapshot.transform.position.y, transform_snapshot.transform.position.z);
            e.transform.rotation = new Quaternion(transform_snapshot.transform.orientation.x, transform_snapshot.transform.orientation.y, transform_snapshot.transform.orientation.z, transform_snapshot.transform.orientation.w);
            if(e.needs_transform_update != undefined) e.needs_transform_update = true;

            if(e.rigidbody){
                //const pos = new Vector3(transform_snapshot.transform.position.x, transform_snapshot.transform.position.y, transform_snapshot.transform.position.z);
                e.rigidbody.setNextKinematicTranslation(e.transform.translation);
                e.joined_entity.rigidbody.wakeUp();
            }
        }
    }
    
    setTrackedPoints(){
        if(!this.session.inputSources) return;

        console.log(this.session.inputSources);
        this.session.inputSources.forEach(source => {
            if(source.hand) this.setHandPoses(source.hand, source.handedness as Handedness);
            else if(source.gripSpace) this.setGripPoses(source.gripSpace, source.handedness as Handedness);
            if(source.gamepad){
                this.gamepad.set_gamepad(source.gamepad, source.handedness as Handedness);
                console.log("gamepad ready");
            }
        });
    }

    setHandPoses(hand : XRHand, handedness : Handedness)
    {
        this.handTrackingActive = true;

        if(handedness === Handedness.Left) this.leftHand = hand;
        else this.rightHand = hand;
        
        console.log(`Setting ${handedness} joint poses`);
        this.entities.forEach((e : XRTrackedEntity) => {
            //if the entity is on the same hand as the one we're looking at
            if(e.handedness === handedness){
                //set the joint space pointer to the entities pointer
                e.joint_space = hand.get(e.point_name as unknown as XRHandJoint);
            } 
        })
    }

    setGripPoses(controller : EventTarget, handedness : Handedness)
    {
        this.handTrackingActive = false;
        //console.log("grip space: ", controller);

        if(handedness === Handedness.Left) this.leftHand = controller;
        else this.rightHand = controller;

        this.entities.forEach((e : XRTrackedEntity) => {
            //if the entity is on the same hand as the one we're looking at
            if(e.handedness === handedness){
                //set the joint space pointer to the entities pointer
                e.joint_space = controller as XRJointSpace;
            } 
        })

    }

}

