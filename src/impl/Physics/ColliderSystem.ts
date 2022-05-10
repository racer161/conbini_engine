import { ActiveEvents, ColliderDesc } from "@dimforge/rapier3d";
import { keys } from "ts-transformer-keys";
import RapierPhysics from "../../../include/RapierPhysics";
import { System } from "../../core/System";
import { RigidbodyEntity, RigidbodySystem } from "./RigidbodySystem";
import { RigidbodyComponent } from "./RigidbodySystem";

export interface ColliderComponent{
    collider? : ColliderDesc;
}

export interface ColliderEntity extends ColliderComponent, RigidbodyComponent {}

export class ColliderSystem<T extends ColliderEntity> extends System<T>{
    name: string = "Collider";
    physics: RapierPhysics;

    archetype: string[] = keys<ColliderEntity>();

    async init_system(): Promise<void>
    {
        this.physics = (this.world.system_array.find(s => s instanceof RigidbodySystem) as RigidbodySystem<RigidbodyEntity>).physics;
    }

    async init_entity(e: T) 
    {
        e.collider.setActiveEvents(ActiveEvents.COLLISION_EVENTS);
        this.physics.world.createCollider(e.collider, e.rigidbody.handle);
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