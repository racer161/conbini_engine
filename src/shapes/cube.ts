import { ColliderDesc, RigidBody, RigidBodyDesc, RigidBodyType } from "@dimforge/rapier3d";
import { BoxGeometry, ColorRepresentation, DoubleSide, FrontSide, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, Side } from "three";
import { Entity } from "../core/Entity";
import { ColliderComponent, PhysicsEntity, RigidBodyComponent } from "../impl/Physics";
import { RenderEntity } from "../impl/Renderer";
import { float3 } from "../primitives";
import { Quaternion } from "../primitives/Quaternion";
import { Transform } from "../primitives/Transform";

export function cube(width : number, height : number=width, depth : number = width, color : ColorRepresentation = 0xffffff, rigidbody_type : RigidBodyType, transform?: Transform) : Entity & RenderEntity & PhysicsEntity & ColliderComponent
{

    const geometry = new BoxGeometry( width, height, depth );
    const material = new MeshPhysicalMaterial( { color: color, side: FrontSide } );

    const rigidbody_desc = new RigidBodyDesc(rigidbody_type);
    rigidbody_desc.mass = 1;
    rigidbody_desc.ccdEnabled = true;
    const colliderDesc = ColliderDesc.cuboid(width/2, height/2, depth/2);

    return {
        id: undefined,
        rigidBodyDesc: rigidbody_desc,
        rigidbody : undefined,
        transform : transform ? transform : new Transform(),
        collider : colliderDesc,
        mesh : new Mesh(geometry, material)
    };

}