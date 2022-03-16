
import { ColliderDesc } from '@dimforge/rapier3d';
import * as THREE from 'three';
import { XRJointSpace } from 'three';
import {h} from '../engine/JSX';
import { Transform } from '../primitives/Transform';

export interface HandComponent{
    joint_name : string,
    joint_space : XRJointSpace,
    hand_type : HandType
}

export enum HandType
{
    Left,
    Right,
    Middle
}

const HandJointEntity = (props : { joint_name : string, hand_type: HandType}) => (
    <entity hand_type={props.hand_type} 
            joint_space
            joint_name={props.joint_name} 
            transform={new Transform()} 
            mesh 
            geometry={new THREE.BoxGeometry( .01, 0.01, .01 )}
            rigidbody
            collider={ColliderDesc.cuboid(.01, 0.01, .01)}
            kinematic
            material={new THREE.MeshBasicMaterial( {color: 0x0000ff, side: THREE.DoubleSide})}
    />
);


const HandEntity = (props : { hand_type : HandType }) => (
    <div>
        <HandJointEntity joint_name="wrist" hand_type={props.hand_type}/>

        <HandJointEntity joint_name="thumb-metacarpal" hand_type={props.hand_type}/>
        <HandJointEntity joint_name="thumb-phalanx-proximal" hand_type={props.hand_type}/>
        <HandJointEntity joint_name="thumb-phalanx-distal" hand_type={props.hand_type}/>
        <HandJointEntity joint_name="thumb-tip" hand_type={props.hand_type}/>

        <HandJointEntity joint_name="index-finger-metacarpal" hand_type={props.hand_type}/>
        <HandJointEntity joint_name="index-finger-phalanx-proximal" hand_type={props.hand_type}/>
        <HandJointEntity joint_name="index-finger-phalanx-intermediate" hand_type={props.hand_type}/>
        <HandJointEntity joint_name="index-finger-phalanx-distal" hand_type={props.hand_type}/>
        <HandJointEntity joint_name="index-finger-tip" hand_type={props.hand_type}/>

        <HandJointEntity joint_name="middle-finger-metacarpal" hand_type={props.hand_type}/>
        <HandJointEntity joint_name="middle-finger-phalanx-proximal" hand_type={props.hand_type}/>
        <HandJointEntity joint_name="middle-finger-phalanx-intermediate" hand_type={props.hand_type}/>
        <HandJointEntity joint_name="middle-finger-phalanx-distal" hand_type={props.hand_type}/>
        <HandJointEntity joint_name="middle-finger-tip" hand_type={props.hand_type}/>

        <HandJointEntity joint_name="ring-finger-metacarpal" hand_type={props.hand_type}/>
        <HandJointEntity joint_name="ring-finger-phalanx-proximal" hand_type={props.hand_type}/>
        <HandJointEntity joint_name="ring-finger-phalanx-intermediate" hand_type={props.hand_type}/>
        <HandJointEntity joint_name="ring-finger-phalanx-distal" hand_type={props.hand_type}/>
        <HandJointEntity joint_name="ring-finger-tip" hand_type={props.hand_type}/>

        <HandJointEntity joint_name="pinky-finger-metacarpal" hand_type={props.hand_type}/>
        <HandJointEntity joint_name="pinky-finger-phalanx-proximal" hand_type={props.hand_type}/>
        <HandJointEntity joint_name="pinky-finger-phalanx-intermediate" hand_type={props.hand_type}/>
        <HandJointEntity joint_name="pinky-finger-phalanx-distal" hand_type={props.hand_type}/>
        <HandJointEntity joint_name="pinky-finger-tip" hand_type={props.hand_type}/>
    </div>
);

export const LeftHandEntity = (<HandEntity hand_type={HandType.Left} />);
export const RightHandEntity = (<HandEntity hand_type={HandType.Right} />);