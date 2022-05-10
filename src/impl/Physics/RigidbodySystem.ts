import { ActiveEvents, RigidBody , RigidBodyDesc } from "@dimforge/rapier3d";
import { keys } from "ts-transformer-keys";
import RapierPhysics from "../../../include/RapierPhysics";
import { System } from "../../core/System";
import { float3 } from "../../primitives";
import { Quaternion } from "../../primitives/Quaternion";
import { TransformComponent } from "../Transformation";

export interface RigidbodyComponent{
    rigidBodyDesc : RigidBodyDesc;
    rigidbody : RigidBody;
}

export interface RigidbodyEntity extends TransformComponent, RigidbodyComponent{}

export class RigidbodySystem<T extends RigidbodyEntity> extends System<T>{
    

    name: string = "RigidbodySystem";

    archetype: string[] = keys<RigidbodyEntity>();

    physics: RapierPhysics;

    init_entity_passes = 2;
    run_priority: number = 1;

    async init_system(): Promise<void>
    {
        this.physics = await RapierPhysics.fromWASM();
    }

    
    async init_entity(e : RigidbodyEntity) : Promise<void>
    {
        e.rigidBodyDesc.setTranslation(e.transform.translation.x, e.transform.translation.y, e.transform.translation.z);
        e.rigidBodyDesc.setRotation(e.transform.rotation);
        e.rigidbody = this.physics.world.createRigidBody(e.rigidBodyDesc);
    }

    async beforeUpdate(): Promise<void>{
        // Step the simulation forward
        this.physics.world.step();
    }

    async update(e: T): Promise<void> {
        const translation = e.rigidbody.translation();
        const rotation = e.rigidbody.rotation();

        //TODO: this should be local transform if there is a parent object?
        //only top level entities can have physics?
        e.transform.compose(new float3(translation.x, translation.y, translation.z), Quaternion.fromRapier(rotation), e.transform.scale);
    }
}