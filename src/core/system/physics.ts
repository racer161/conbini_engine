import { Entity, System } from ".";
import RapierPhysics from './rapier';

interface RigidBodyEntity extends Entity{
    rigid_body_index: number;
}

export class PhysicsSystem extends System<RigidBodyEntity>
{
    rapier_physics: RapierPhysics;

    async init(): Promise<void>
    {
        this.rapier_physics = await RapierPhysics.fromWASM();
    }

    criteria(e: Entity): e is RigidBodyEntity
    {
        return Object.prototype.hasOwnProperty.call(e, "position_index");
    }

    async update(e: RigidBodyEntity): Promise<void>
    {
        const rigidbody = this.rapier_physics e.rigid_body_index; 

        rigidbody.position += e.velocity;
        rigidbody.velocity += e.acceleration;
    }

}