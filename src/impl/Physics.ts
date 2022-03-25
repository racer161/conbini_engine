import { System } from "../core/System";
import RapierPhysics from '../../include/RapierPhysics';
import { ColliderDesc, JointData, JointType, MotorModel, PrismaticImpulseJoint, RigidBody, RigidBodyDesc, RigidBodyType, World } from "@dimforge/rapier3d";
import { TransformComponent } from "../primitives/Transform";
import { Entity, Static } from "../core/Entity";
import { keys } from "ts-transformer-keys";
import { float3 } from "../primitives";
import { Quaternion } from "../primitives/Quaternion";
import { Scene } from "../engine/Scene";

export interface RigidBodyComponent{
    rigidbody_type : RigidBodyType;
    rigidbody : RigidBody;
}

export interface CCDComponent{
    rigidbody_ccd? : boolean;
}

export interface ColliderComponent{
    collider? : ColliderDesc;
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

function init_collider(e : PhysicsEntity & Entity & Static & MassComponent & ColliderComponent, world : World)
{
    //let group1 = 0x00010001;

    let collider = world.createCollider(e.collider, e.rigidbody.handle);
    //collider.setCollisionGroups(group1);
}

function init_joints (e : PhysicsEntity & Entity & Static & MassComponent & JointComponent, world : World, scene : Scene)
{
    let axis = { x: 0.0, y: 1.0, z: 0.0 };
    let params = JointData.prismatic({ x: 0.0, y: 0.0, z: 0.0 }, { x: 0.0, y: 0.0, z: 0.0 }, axis);
    params.limitsEnabled = true;
    params.limits = [-0.001, 0.001];
    //params.jointType = e.joint_type;
    
    let joint = world.createImpulseJoint(params, e.rigidbody, e.joined_entity.rigidbody);

    (joint as PrismaticImpulseJoint).configureMotorPosition(0, 0.5, 0.5);
    //(joint as PrismaticImpulseJoint).configureMotorModel(MotorModel.AccelerationBased);
}