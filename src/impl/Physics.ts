import { System } from "../core/System";
import RapierPhysics from '../../include/RapierPhysics';
import { ColliderDesc, RigidBody, RigidBodyDesc, RigidBodyType } from "@dimforge/rapier3d";
import { TransformComponent } from "../primitives/Transform";
import { Entity, Static } from "../core/Entity";
import { keys } from "ts-transformer-keys";
import { float3 } from "../primitives";
import { Quaternion } from "../primitives/Quaternion";

export interface RigidBodyComponent{
    rigidbody : RigidBody;
}

export interface ColliderComponent{
    collider : ColliderDesc;
}

export interface KinematicComponent{
    kinematic : boolean;
}

interface PhysicsEntity extends TransformComponent, RigidBodyComponent, ColliderComponent{}

export class Physics<T extends Entity & PhysicsEntity> extends System<T>{

    name: string = "Physics";

    archetype: string[] = keys<PhysicsEntity>();

    physics: RapierPhysics;

    init_priority: number = 1;
    run_priority: number = 1;

    async init(): Promise<void>
    {
        let group1 = 0x00010001;

        this.physics = await RapierPhysics.fromWASM();

        //init entities into the threejs scene
        this.scene.entities_x_system.get(this.name).forEach((e : PhysicsEntity & Entity & Static & KinematicComponent) => {


            let rigidbody_type : RigidBodyType = (() => {
                if(e.static) return RigidBodyType.Static;
                if(e.kinematic) return RigidBodyType.KinematicPositionBased;
                return RigidBodyType.Dynamic;
            })();

            console.log(e.static);
            // Create a dynamic rigid-body.
            let rigidBodyDesc = new RigidBodyDesc(rigidbody_type);
            
            const translation = e.transform.translation();
            const rotation = e.transform.rotation();

            rigidBodyDesc.setTranslation(translation.value[0], translation.value[1], translation.value[2]);
            rigidBodyDesc.setRotation(rotation.asRapier());
            e.rigidbody = this.physics.world.createRigidBody(rigidBodyDesc);


            e.collider.setCollisionGroups(group1);


            // Create a cuboid collider attached to the dynamic rigidBody. 
            let collider = this.physics.world.createCollider(e.collider, e.rigidbody.handle);
        })
    }


    async beforeUpdate(): Promise<void>{
        // Step the simulation forward
        this.physics.world.step();
    }

    async update(e: T & Static): Promise<void> {
        const translation = e.rigidbody.translation();
        const rotation = e.rigidbody.rotation();
        e.transform.compose(new float3(translation.x, translation.y, translation.z), Quaternion.fromRapier(rotation), new float3(1,1,1));

    }
    

}