import { System } from "../core/System";
import RapierPhysics from '../../include/RapierPhysics';
import { ColliderDesc, JointData, JointType, MotorModel, PrismaticImpulseJoint, RigidBody, RigidBodyDesc, RigidBodyType, World } from "@dimforge/rapier3d";
import { TransformComponent } from "../primitives/Transform";
import { Entity, Static } from "../core/Entity";
import { keys } from "ts-transformer-keys";
import { float3 } from "../primitives";
import { Quaternion } from "../primitives/Quaternion";
import { Scene } from "../core/Scene";

export interface RigidBodyComponent{
    rigidbody_type : RigidBodyType;
    rigidbody : RigidBody;
    gravity_coefficient : number;
}

export interface CCDComponent{
    rigidbody_ccd? : boolean;
}

export interface ColliderComponent{
    collider : ColliderDesc;
    collision_group : number;
}

export interface MassComponent{
    mass? : number;
}

export interface JointComponent{
    joint_type? : JointType;
    joined_entity? : RigidBodyComponent;
    joint_anchor_1? : float3;
    joint_anchor_2? : float3;
}

export interface PhysicsEntity extends TransformComponent, RigidBodyComponent{}

export class Physics<T extends Entity & PhysicsEntity> extends System<T>{

    name: string = "Physics";

    archetype: string[] = keys<PhysicsEntity>();

    physics: RapierPhysics;

    init_priority: number = 1;
    run_priority: number = 1;

    async init(): Promise<void>
    {
        this.physics = await RapierPhysics.fromWASM();

        //init entities into the threejs scene
        this.scene.entities_x_system.get(this.name).forEach((e : PhysicsEntity & Entity & Static & MassComponent & ColliderComponent & CCDComponent) => {
            init_rigidbody(e, this.physics.world);
            if(e.collider) init_collider(e, this.physics.world);

        })

        //Separate joint pass
        this.scene.entities_x_system.get(this.name).forEach((e : PhysicsEntity & Entity & Static & MassComponent & JointComponent & ColliderComponent) => {
            //if it has a joint
            if(e.joint_type) init_joints(e, this.physics.world, this.scene);
        })


    }

    async beforeUpdate(): Promise<void>{
        // Step the simulation forward
        this.physics.world.step();
    }

    async update(e: T & Static): Promise<void> {
        const translation = e.rigidbody.translation();
        const rotation = e.rigidbody.rotation();
        e.transform.compose(new float3([translation.x, translation.y, translation.z]), Quaternion.fromRapier(rotation), float3.one);

    }
}

function init_rigidbody(e : PhysicsEntity & Entity & Static & MassComponent & CCDComponent, world : World)
{
    // Create a dynamic rigid-body.
    let rigidBodyDesc = new RigidBodyDesc(e.rigidbody_type);
    if(e.gravity_coefficient) rigidBodyDesc.setGravityScale(e.gravity_coefficient);

    if(e.rigidbody_ccd) rigidBodyDesc.setCcdEnabled(true);

    if(e.mass){
        rigidBodyDesc.mass = e.mass;
    }
    
    const translation = e.transform.translation();
    const rotation = e.transform.rotation();

    rigidBodyDesc.setTranslation(translation.value[0], translation.value[1], translation.value[2]);
    rigidBodyDesc.setRotation(rotation.asRapier());
    e.rigidbody = world.createRigidBody(rigidBodyDesc);
    
}

//Default collision mask is a part of group 0 but collides with everything else
const default_collision_mask = getCollisionMask( 0b1, 0b1111_1111_1111_1111);

function init_collider(e : PhysicsEntity & Entity & Static & MassComponent & ColliderComponent, world : World)
{

    let collider = world.createCollider(e.collider, e.rigidbody.handle);

    //if the entity explicitly set a collision group use it otherwise use the default
    collider.setCollisionGroups(e.collision_group ? e.collision_group : default_collision_mask);
}

function init_joints (e : PhysicsEntity & Entity & Static & MassComponent & JointComponent, world : World, scene : Scene)
{
    let axis = { x: 0.0, y: 1.0, z: 0.0 };
    let params = JointData.prismatic({ x: 0.0, y: 0.0, z: 0.0 }, { x: 0.0, y: 0.0, z: 0.0 }, axis);
    params.limitsEnabled = true;
    params.limits = [-0.1, 0.1];
    
    let joint = world.createImpulseJoint(params, e.rigidbody, e.joined_entity.rigidbody);

    (joint as PrismaticImpulseJoint).configureMotorPosition(0, 1, 0);
}

//https://www.rapier.rs/docs/user_guides/javascript/colliders#collision-groups-and-solver-groups
//The membership and filter are both 16-bit bit masks packed into a single 32-bits value. The 16 left-most bits contain the memberships whereas the 16 right-most bits contain the filter.
//The membership is a bit mask where each bit represents a collision group. A 1 means the entity is a member of the group.
//The filter is a bit mask where each bit represents a collision group. A 1 means the entity will collide with the group.
//eg. getCollisionMask(0b0000_0000_0000_1101, 0b0000_0000_0000_0000) = 0b0000_0000_0000_1101_0000_0000_0000_0000
export function getCollisionMask(membership : number, filter : number) : number
{
    return (membership << 16) | filter;
}

function dec2bin(dec : number) {
    return (dec >>> 0).toString(2);
}