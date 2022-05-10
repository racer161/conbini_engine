
import { Ball, ColliderDesc, JointData, JointType, RigidBodyDesc, RigidBodyType, Shape } from '@dimforge/rapier3d';
import { join } from 'path';
import { DoubleSide, Mesh, MeshBasicMaterial, Side, Sphere, SphereGeometry, Vector3, XRJointSpace } from 'three';
import { Entity } from '../core/Entity';
import { float3 } from '../primitives';
import { Quaternion } from '../primitives/Quaternion';
import { Transform } from '../primitives/Transform';
import { ColliderComponent, getCollisionMask, JointComponent, RigidbodyEntity } from '../impl/Physics';
import { RenderEntity } from '../impl/Renderer';
import { Handedness, TrackedPointComponent } from '../impl/Input/XRInput';

function hand_joint_entity(point_name : string, handedness: Handedness) : Entity[]
{
    const geometry = new SphereGeometry(0.01,8,8 );
    const material = new MeshBasicMaterial( {color: 0xffffff , side: DoubleSide} );

    const translation = new float3(100,100,100);
    const rotation = Quaternion.identity;
    const scale = new float3(1,1,1);

    // Create a dynamic rigid-body.
    let rigidBodyDesc = new RigidBodyDesc(RigidBodyType.Dynamic);
    rigidBodyDesc.setGravityScale(0);
    rigidBodyDesc.setCcdEnabled(true);
    rigidBodyDesc.mass = 0.1;

    rigidBodyDesc.setTranslation(translation[0], translation[1], translation[2]);
    rigidBodyDesc.setRotation(rotation);

    const shape = new Ball(0.01);
    const colliderDesc = new ColliderDesc(shape);
    colliderDesc.setCollisionGroups(getCollisionMask( 0b01, 0b1));
    colliderDesc.setFriction(0.5);

    
    const physics_sphere : Entity & RigidbodyEntity & RenderEntity & ColliderComponent  = 
    { 
        id: undefined,
        name: point_name + "-" + handedness + "-sphere",
        transform: Transform.fromPositionRotationScale(translation, rotation, scale),
        mesh: new Mesh( geometry, material ),
        rigidBodyDesc: rigidBodyDesc,
        rigidbody: undefined,
        collider: colliderDesc
    };

    // Create a dynamic rigid-body.
    let hand_tracked_rigidBodyDesc = new RigidBodyDesc(RigidBodyType.KinematicPositionBased);

    let axis = { x: 0.0, y: 1.0, z: 0.0 };
    let joint_data = JointData.prismatic({ x: 0.0, y: 0.0, z: 0.0 }, { x: 0.0, y: 0.0, z: 0.0 }, axis);
    joint_data.limitsEnabled = true;
    joint_data.limits = [-0.01, 0.01];

    const hand_tracked_point : Entity & TrackedPointComponent & RigidbodyEntity & JointComponent = {
        id: undefined,
        isHand: true,
        name: point_name + "-" + handedness + "-tracker",
        handedness: handedness,
        joint_space: undefined,
        point_name: point_name,
        joint_data: joint_data,
        joint: undefined,
        transform: Transform.identity,
        rigidbody: undefined,
        rigidBodyDesc: hand_tracked_rigidBodyDesc,
        joined_entity : physics_sphere,
    };

    return [physics_sphere, hand_tracked_point];
    
}


function hand_entity(hand_type : Handedness) : Entity[]
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

export const LeftHandEntity = hand_entity(Handedness.Left);
export const RightHandEntity = hand_entity(Handedness.Right);