import { System } from "../core/System";
import RapierPhysics from '../../include/RapierPhysics';
import { ColliderDesc, RigidBody, RigidBodyDesc } from "@dimforge/rapier3d";
import { PositionComponent } from "./Transform";
import { Entity } from "../core/Entity";
import { keys } from "ts-transformer-keys";

interface RigidBodyComponent{
    rigidbody : RigidBody;
}

interface ColliderComponent{
    collider : ColliderDesc;
}

interface PhysicsEntity extends PositionComponent, RigidBodyComponent, ColliderComponent{}


export class Physics<T extends Entity & PhysicsEntity> extends System<T>{

    name: string = "Physics";

    archetype: string[] = keys<PhysicsEntity>();

    physics: RapierPhysics;

    async init(): Promise<void>
    {
        this.physics = await RapierPhysics.fromWASM();

        //init entities into the threejs scene
        this.scene.entities_x_system.get(this.name).forEach((e : PhysicsEntity & Entity) => {
            // Create a dynamic rigid-body.
            let rigidBodyDesc = e.static ? RigidBodyDesc.newStatic() : RigidBodyDesc.newDynamic();
            rigidBodyDesc.setTranslation(e.position[0], e.position[1], e.position[2]);
            e.rigidbody = this.physics.world.createRigidBody(rigidBodyDesc);

            // Create a cuboid collider attached to the dynamic rigidBody. 
            let collider = this.physics.world.createCollider(e.collider, e.rigidbody.handle);
        })
    }


    async beforeUpdate(): Promise<void>{
        // Step the simulation forward
        this.physics.world.step();
    }

    async update(e: T): Promise<void> {
        const translation = e.rigidbody.translation();
        //Update the position component
        e.position.set([translation.x, translation.y, translation.z]);
    }
    

}