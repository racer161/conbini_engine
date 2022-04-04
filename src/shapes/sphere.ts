import { ColliderDesc, RigidBodyType } from "@dimforge/rapier3d";
import { ColorRepresentation, DoubleSide, FrontSide, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, SphereGeometry } from "three";
import { Entity } from "../core/Entity";
import { CCDComponent, ColliderComponent, MassComponent, PhysicsEntity } from "../impl/Physics";
import { RenderEntity } from "../impl/Renderer";
import { float3 } from "../primitives";
import { Quaternion } from "../primitives/Quaternion";
import { Transform } from "../primitives/Transform";

export function sphere(radius : number, color : ColorRepresentation = 0xffffff, segments : number = 8, rigidbody_type : RigidBodyType, transform: Transform ) : Entity & RenderEntity & PhysicsEntity & ColliderComponent & CCDComponent & MassComponent
{
    const geometry = new SphereGeometry(radius, segments, segments);
    const material = new MeshPhysicalMaterial( { color: color, side: FrontSide } );

    return {
        id: "",
        rigidbody_type : rigidbody_type, 
        rigidbody : undefined,
        gravity_coefficient : undefined,
        transform : transform ? transform : new Transform(),
        collider : ColliderDesc.ball(radius),
        collision_group : undefined,
        rigidbody_ccd : true,
        mesh : new Mesh(geometry, material),
        mass : 1
    };

}