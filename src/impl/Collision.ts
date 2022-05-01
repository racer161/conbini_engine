//TODO: Make a component for collision detection
//only call collision event callbacks for entities that have this component
//perform this check in the collision system
//and keep track of collision state in the collision map

import { TempContactManifold, World } from "@dimforge/rapier3d";
import { XRFrame } from "three";
import { keys } from "ts-transformer-keys";
import { Entity } from "../core/Entity";
import { System } from "../core/System";
import { TransformComponent } from "../primitives/Transform";
import { ColliderComponent, Physics, PhysicsEntity, RigidBodyComponent } from "./Physics";

export interface CollisionSubscriberComponent
{
    call_on_collision : boolean,
    listen_to_collisions_with : PhysicsEntity[]
}

export interface CollisionEntity extends TransformComponent, RigidBodyComponent, ColliderComponent, CollisionSubscriberComponent {}


//THIS SYSTEM MUST ALWAYS BE INITIALIZED AFTER THE PHYSICS SYSTEM
//To register collsions properly all rigidibodies involved must be initialized so they have a handle
export class Collision<T extends CollisionEntity> extends System<T>{
    name: string = "Collision";

    collision_map: Set<[number,number]>;

    archetype: string[] = keys<CollisionEntity>();

    physics_world: World;

    on_collision_listeners: System<any>[] = [];

    async init_system(): Promise<void> {
        const physics = this.world.system_array.find(s => s instanceof Physics) as Physics<PhysicsEntity>;
        this.physics_world = physics.physics.world;
        //pair down the number of systems to call
        for(let system of this.world.system_array)
        {
            //if the system has function defined then it can listen for collision events
            if(system.onCollision) this.on_collision_listeners.push(system);
        }
    }

    
    async update(e: CollisionEntity, time: number, frame?: XRFrame): Promise<void> {
        if(!e.call_on_collision) return;

        //TODO: this only calls for the 0th collider
        //expand to multiple colliders? or enforce 0 only?
        const handle1 = e.rigidbody.collider(0);

        //TODO: flatten this out into a more efficient array of collider handle integers rather than pure Entity references
        for(let other_e of e.listen_to_collisions_with)
        {
            const handle2 = other_e.rigidbody.collider(0);
            this.physics_world.contactPair(handle1, handle2, (_manifold : TempContactManifold, _flipped : boolean) => {
                
    
                for(let listener of this.on_collision_listeners)
                {
                    if(listener.entities.has(e)) listener.onCollision(e, e, CollisionState.Collision, _manifold, _flipped);
                }
                
             });
        }
        
    }

    //DEBUG calls itself :)
    onCollision(e: T, other: PhysicsEntity, state: CollisionState, manifold: TempContactManifold, flipped: boolean): void {
        // Contact information can be read from `manifold`. 
        console.log(`Collision detected between ${e} and ${other}`);
    }
    

}

export enum CollisionState
{
    CollisionStarts = 0,
    Collision = 1,
    CollisionEnds = 2
}