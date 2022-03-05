import { System } from "../core/System";
import RapierPhysics from '../../include/RapierPhysics';
import { RigidBody } from "@dimforge/rapier3d";
import { PositionComponent } from "./Transform";
import { Entity } from "../core/Entity";
import { keys } from "ts-transformer-keys";

interface RigidBodyComponent{
    rigidBody : RigidBody;
}

interface PhysicsEntity extends PositionComponent, RigidBodyComponent{}


export class Physics<T extends Entity & PhysicsEntity> extends System<T>{

    name: string = "Physics";

    archetype: string[] = keys<PhysicsEntity>();

    physics: RapierPhysics;

    async init(): Promise<void>
    {
        this.physics = await RapierPhysics.fromWASM();
    }


    async beforeUpdate(): Promise<void>{
        // Step the simulation forward
        this.physics.world.step();
    }

    async update(e: T): Promise<void> {
        const translation = e.rigidBody.translation();
        //Update the position component
        e.position.set([translation.x, translation.y, translation.z]);
    }
    

}

/*
        const physics = await RapierPhysics.fromWASM();
        //physics.buildDefaultWorld();

        // Create a dynamic rigid-body.
        let rigidBodyDesc = RigidBodyDesc.newDynamic().setTranslation(0.0, 1.0, 0.0);
        let rigidBody = physics.world.createRigidBody(rigidBodyDesc);

        // Create a cuboid collider attached to the dynamic rigidBody.
        let colliderDesc = ColliderDesc.cuboid(0.5, 0.5, 0.5);
        let collider = physics.world.createCollider(colliderDesc, rigidBody.handle);

*/