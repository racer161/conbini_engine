
import { ColliderDesc, JointType, RigidBodyType } from '@dimforge/rapier3d';
import { DoubleSide, Mesh, MeshBasicMaterial, Side, Sphere, SphereGeometry, Vector3, XRJointSpace } from 'three';
import { Entity } from '../core/Entity';
import { float3 } from '../primitives';
import { Transform } from '../primitives/Transform';
import { CCDComponent, ColliderComponent, JointComponent, MassComponent, PhysicsEntity } from './Physics';
import { RenderEntity } from './Renderer';

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

function hand_joint_entity(joint_name : string, hand_type: HandType) : Entity[]
{

    const geometry = new SphereGeometry(0.01,8,8 );
    const material = new MeshBasicMaterial( {color: 0xffffff , side: DoubleSide} );

    const physics_cube : Entity & PhysicsEntity & RenderEntity & CCDComponent & ColliderComponent & MassComponent = 
    { 
        id: undefined,
        transform: new Transform(),
        mesh: new Mesh( geometry, material ),
        geometry: geometry,
        rigidbody: undefined,
        rigidbody_type: RigidBodyType.Dynamic,
        rigidbody_ccd: true,
        collider: ColliderDesc.ball(.01).setFriction(1),
        material: material,
        mass: 0.1 
    };

    const hand_tracked_point : Entity & HandComponent & PhysicsEntity & JointComponent = {
        id: undefined,
        hand_type: hand_type,
        joint_space: undefined,
        joint_name: joint_name,
        transform: new Transform(),
        rigidbody: undefined,
        rigidbody_type: RigidBodyType.KinematicPositionBased,
        joint_type: JointType.Spherical,
        joined_entity : physics_cube,
        joint_anchor_1 : float3.zero,
        joint_anchor_2: float3.zero,
    };

    return [physics_cube, hand_tracked_point];
    
}


function hand_entity(hand_type : HandType) : Entity[]
{ 
    return [
        ...hand_joint_entity("wrist", hand_type),

        ...hand_joint_entity( "thumb-metacarpal" , hand_type ),
        ...hand_joint_entity( "thumb-phalanx-proximal" , hand_type ),
        ...hand_joint_entity( "thumb-phalanx-distal" , hand_type ),
        ...hand_joint_entity( "thumb-tip" , hand_type ),

        ...hand_joint_entity( "index-finger-metacarpal" , hand_type ),
        ...hand_joint_entity( "index-finger-phalanx-proximal" , hand_type ),
        ...hand_joint_entity( "index-finger-phalanx-intermediate" , hand_type ),
        ...hand_joint_entity( "index-finger-phalanx-distal" , hand_type ),
        ...hand_joint_entity( "index-finger-tip" , hand_type ),

        ...hand_joint_entity( "middle-finger-metacarpal" , hand_type ),
        ...hand_joint_entity( "middle-finger-phalanx-proximal" , hand_type ),
        ...hand_joint_entity( "middle-finger-phalanx-intermediate" , hand_type ),
        ...hand_joint_entity( "middle-finger-phalanx-distal" , hand_type ),
        ...hand_joint_entity( "middle-finger-tip" , hand_type ),

        ...hand_joint_entity( "ring-finger-metacarpal" , hand_type ),
        ...hand_joint_entity( "ring-finger-phalanx-proximal" , hand_type ),
        ...hand_joint_entity( "ring-finger-phalanx-intermediate" , hand_type ),
        ...hand_joint_entity( "ring-finger-phalanx-distal" , hand_type ),
        ...hand_joint_entity( "ring-finger-tip" , hand_type ),

        ...hand_joint_entity( "pinky-finger-metacarpal" , hand_type ),
        ...hand_joint_entity( "pinky-finger-phalanx-proximal" , hand_type ),
        ...hand_joint_entity( "pinky-finger-phalanx-intermediate" , hand_type ),
        ...hand_joint_entity( "pinky-finger-phalanx-distal" , hand_type ),
        ...hand_joint_entity( "pinky-finger-tip" , hand_type ),
    ] as Entity[];
}

export const LeftHandEntity = hand_entity(HandType.Left);
export const RightHandEntity = hand_entity(HandType.Right);