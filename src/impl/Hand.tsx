
import { ColliderDesc, JointType, RigidBodyType } from '@dimforge/rapier3d';
import * as THREE from 'three';
import { XRJointSpace } from 'three';
import {h} from '../engine/JSX';
import { float3 } from '../primitives';
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

const HandJointEntity = (props : { joint_name : string, hand_type: HandType}) => {
    const physics_cube = (<entity 
        transform={new Transform()} 
        mesh 
        geometry={new THREE.BoxGeometry( .01, 0.01, .01 )}
        rigidbody
        rigidbody_type={RigidBodyType.Dynamic}
        rigidbody_ccd={true}
        collider={ColliderDesc.cuboid(.01, 0.01, .01).setFriction(1)}

        material={new THREE.MeshBasicMaterial( {color: 0x0000ff, side: THREE.DoubleSide})} 
        mass={0.1}
        />);

    const hand_tracked_point = (<entity hand_type={props.hand_type}
        joint_space
        joint_name={props.joint_name} 
        transform={new Transform()} 
        rigidbody
        rigidbody_type={RigidBodyType.KinematicPositionBased}
        joint_type={JointType.Spherical}
        joined_entity_id={physics_cube.id}
        joint_anchor_1={new float3(0,0,0)}
        joint_anchor_2={new float3(0,0,0)}
    />);

    return (
        <div>
            {hand_tracked_point}
            {physics_cube}
        </div>
    )
    
}


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