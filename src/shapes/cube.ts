import { ColliderDesc, RigidBody, RigidBodyType } from "@dimforge/rapier3d";
import { BoxGeometry, ColorRepresentation, DoubleSide, Mesh, MeshBasicMaterial } from "three";
import { Entity } from "../core/Entity";
import { CCDComponent, ColliderComponent, PhysicsEntity, RigidBodyComponent } from "../impl/Physics";
import { RenderEntity } from "../impl/Renderer";
import { float3 } from "../primitives";
import { Quaternion } from "../primitives/Quaternion";
import { Transform } from "../primitives/Transform";

export function cube(width : number, height : number=width, depth : number = width, color : ColorRepresentation = 0xffffff, rigidbody_type : RigidBodyType, transform?: Transform) : Entity & RenderEntity & PhysicsEntity & ColliderComponent & CCDComponent
{

    const geometry = new BoxGeometry( width, height, depth );
    const material = new MeshBasicMaterial( { color: color, side: DoubleSide } );

    return {
        id: undefined,
        rigidbody_type : rigidbody_type, 
        rigidbody : undefined,
        gravity_coefficient : undefined,
        transform : transform ? transform : new Transform(),
        collider : ColliderDesc.cuboid(width/2, height/2, depth/2),
        collision_group : undefined,
        rigidbody_ccd : true,
        mesh : new Mesh(geometry, material),
        geometry : geometry,
        material: material
    };

}