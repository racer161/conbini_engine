import { ColliderDesc, RigidBodyDesc, RigidBodyType } from "@dimforge/rapier3d";
import { ColorRepresentation, DoubleSide, FrontSide, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, SphereGeometry } from "three";
import { Entity } from "../core/Entity";
import { ColliderComponent, RigidbodyEntity } from "../impl/Physics";
import { RenderEntity } from "../impl/Renderer";
import { float3 } from "../primitives";
import { Quaternion } from "../primitives/Quaternion";
import { Transform } from "../primitives/Transform";

export function sphere(radius : number, color : ColorRepresentation = 0xffffff, segments : number = 8, rigidbody_type : RigidBodyType, transform: Transform ) : Entity & RenderEntity & RigidbodyEntity & ColliderComponent
{
    const geometry = new SphereGeometry(radius, segments, segments);
    const material = new MeshPhysicalMaterial( { color: color, side: FrontSide } );

    const rigidbody_desc = new RigidBodyDesc(rigidbody_type);
    rigidbody_desc.mass = 1;
    rigidbody_desc.ccdEnabled = true;

    return {
        id: "",
        rigidBodyDesc: rigidbody_desc,
        rigidbody : undefined,
        transform : transform ? transform : Transform.identity,
        collider : ColliderDesc.ball(radius),
        mesh : new Mesh(geometry, material)
    };

}