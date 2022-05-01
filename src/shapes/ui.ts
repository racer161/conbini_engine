import { ColliderDesc, RigidBodyDesc, RigidBodyType } from "@dimforge/rapier3d";
import { Texture } from "@gltf-transform/core";
import { BoxGeometry, DoubleSide, FrontSide, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, PlaneGeometry, Side, SphereGeometry } from "three";
import { Entity } from "../core/Entity";
import { ColliderComponent, PhysicsEntity } from "../impl/Physics";
import { RenderEntity } from "../impl/Renderer";
import { UIComponent } from "../impl/UI";
import { Transform } from "../primitives/Transform";
import { ConbiniUIDocument } from "../ui/ConbiniUIDocument";


//To maintain absolute UI consistency, XR DPI will be calculated on behalf of the UI System
//whatever the scale of the canvas items, the UI System will scale the ui document accordingly
//so that the UI will always be consistent

//i.e. if the creator wants an element to be bigger they will have to scale up the font size and the element size

//allow hacking of DPI later?

export function ui(transform: Transform, ui_document : ConbiniUIDocument, width : number, height : number=width, depth : number = width) : Entity & RenderEntity & PhysicsEntity & ColliderComponent & UIComponent
{
    const geometry = new PlaneGeometry(width, height);
    const material = new MeshBasicMaterial( { map : ui_document.texture, side: DoubleSide, alphaTest : 0.9 } );

    const rigidbody_desc = new RigidBodyDesc(RigidBodyType.KinematicPositionBased);
    rigidbody_desc.mass = 1;
    rigidbody_desc.ccdEnabled = true;

    return {
        id: "",
        rigidBodyDesc: rigidbody_desc,
        rigidbody : undefined,
        transform : transform ? transform : new Transform(),
        collider : ColliderDesc.cuboid(width/2, height/2, depth/2),
        mesh : new Mesh(geometry, material),
        ui_document : ui_document
    }
}