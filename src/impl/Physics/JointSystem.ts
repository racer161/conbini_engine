import { ImpulseJoint, JointData, PrismaticImpulseJoint } from "@dimforge/rapier3d";
import { keys } from "ts-transformer-keys";
import RapierPhysics from "../../../include/RapierPhysics";
import { Entity } from "../../core/Entity";
import { System } from "../../core/System";
import { RigidbodyComponent, RigidbodyEntity, RigidbodySystem } from "./RigidbodySystem";

export interface JointComponent{
    joint_data? : JointData;
    joined_entity? : Entity & RigidbodyComponent;
    joint?: ImpulseJoint;
}

export interface JointEntity extends JointComponent, RigidbodyComponent {}

export class JointSystem<T extends JointEntity> extends System<T> {
    name: string = "JointSystem";
    physics: RapierPhysics;

    archetype: string[] = keys<JointEntity>();

    async init_system(): Promise<void>
    {
        this.physics = (this.world.system_array.find(s => s instanceof RigidbodySystem) as RigidbodySystem<RigidbodyEntity>).physics;
    }

    async init_entity(e: T): Promise<void> {
        e.joint = this.physics.world.createImpulseJoint(e.joint_data, e.rigidbody, e.joined_entity?.rigidbody );

        (e.joint as PrismaticImpulseJoint).configureMotorPosition(0, 1, 1);
    }

}