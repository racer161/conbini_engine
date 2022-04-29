import { System } from "../core/System";
import RapierPhysics from '../../include/RapierPhysics';
import { ColliderDesc, EventQueue, ImpulseJoint, JointData, JointType, MotorModel, PrismaticImpulseJoint, RigidBody, RigidBodyDesc, RigidBodyType, World } from "@dimforge/rapier3d";
import { TransformComponent } from "../primitives/Transform";
import { Entity, Static } from "../core/Entity";
import { keys } from "ts-transformer-keys";
import { float3 } from "../primitives";
import { Quaternion } from "../primitives/Quaternion";
import { Wrapping } from "three";

//TODO: Implement event queue draining
//TODO: filter entities that don't give a shit about collisions

export interface RigidBodyComponent{
    rigidBodyDesc : RigidBodyDesc;
    rigidbody : RigidBody;
}

export interface ColliderComponent{
    collider : ColliderDesc;
}

export interface JointComponent{
    joint_data : JointData;
    joined_entity? : Entity & RigidBodyComponent;
    joint: ImpulseJoint;
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
        this.world.entities_x_system.get(this.name).forEach((e : PhysicsEntity & Entity & Static & ColliderComponent) => {
            e.rigidBodyDesc.setTranslation(e.transform.translation.x, e.transform.translation.y, e.transform.translation.z);
            e.rigidBodyDesc.setRotation(e.transform.rotation);
            e.rigidbody = this.physics.world.createRigidBody(e.rigidBodyDesc);
            if(e.collider) this.physics.world.createCollider(e.collider, e.rigidbody.handle);

            //TODO: rescale collider after scale change
            //e.rigidbody.collider.

        })

        //Separate joint pass because the rigidbodies don't have a handle before they are initialized above
        this.world.entities_x_system.get(this.name).forEach((e : PhysicsEntity & Entity & Static & JointComponent & ColliderComponent) => {
            //if it has a joint
            if(e.joint_data)
            {
                let joint : ImpulseJoint = this.physics.world.createImpulseJoint(e.joint_data, e.rigidbody, e.joined_entity?.rigidbody );

                (joint as PrismaticImpulseJoint).configureMotorPosition(0, 1, 0);
            }
        })


    }

    async beforeUpdate(): Promise<void>{
        //create the physics event queue
        let eventQueue = new EventQueue(true);
        
        // Step the simulation forward
        this.physics.world.step();

        
    }

    async update(e: T & Static): Promise<void> {
        const translation = e.rigidbody.translation();
        const rotation = e.rigidbody.rotation();
        e.transform.compose(new float3(translation.x, translation.y, translation.z), Quaternion.fromRapier(rotation), e.transform.scale);

    }

    onCollision(e: T, other: Entity): void {
        throw new Error("Method not implemented.");
    }
}

//Default collision mask is a part of group 0 but collides with everything else
export const default_collision_mask = getCollisionMask( 0b1, 0b1111_1111_1111_1111);

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