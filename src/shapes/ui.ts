import { ColliderDesc, RigidBodyDesc, RigidBodyType } from "@dimforge/rapier3d";
import { Texture } from "@gltf-transform/core";
import { BoxGeometry, Color, DoubleSide, FrontSide, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, PlaneGeometry, Side, SphereGeometry } from "three";
import { Entity } from "../core/Entity";
import { ColliderComponent, PhysicsEntity } from "../impl/Physics";
import { RenderEntity } from "../impl/Renderer";
import { UIComponent } from "../impl/UI";
import { float3 } from "../primitives";
import { Transform } from "../primitives/Transform";
import { ConbiniUIDocument } from "../ui/ConbiniUIDocument";

const XR_DPI = 96;
const XR_DPM = XR_DPI / 0.0254;
//To maintain absolute UI consistency, XR DPI will be calculated on behalf of the UI System
//whatever the scale of the canvas items, the UI System will scale the ui document accordingly
//so that the UI will always be consistent

//i.e. if the creator wants an element to be bigger they will have to scale up the font size and the element size

//allow hacking of DPI later?

export function ui(transform: Transform, ui_document : ConbiniUIDocument) : Array<Entity>
{
    const width = ui_document.width/XR_DPM;
    const height = ui_document.height/XR_DPM;

    const geometry = new PlaneGeometry(width, height);
    const material = new MeshStandardMaterial( { map : ui_document.texture, side: DoubleSide, alphaTest : 0.9, emissiveMap: ui_document.texture, emissive: new Color(1.0,1.0,1.0), emissiveIntensity : 0.1} );

    const rigidbody_desc = new RigidBodyDesc(RigidBodyType.KinematicPositionBased);
    rigidbody_desc.mass = 1;
    rigidbody_desc.ccdEnabled = true;

    //TODO: create a second child entity that is the white background of the UI for floating effect


    const background_entity : Entity & RenderEntity = ui_background(width, height, transform);

    const foreground : Entity & RenderEntity & PhysicsEntity & ColliderComponent & UIComponent = {
        id: "",
        rigidBodyDesc: rigidbody_desc,
        rigidbody : undefined,
        transform : transform ? transform : new Transform(),
        collider : ColliderDesc.cuboid(width/2, height/2, .05),
        mesh : new Mesh(geometry, material),
        ui_document : ui_document
    }

    return [foreground, background_entity];
}

function ui_background(width : number, height : number, transform : Transform) : Entity & RenderEntity
{

    const geometry = new PlaneGeometry(width, height);
    const material = new MeshBasicMaterial({ 
        side: DoubleSide,
        transparent: true,
        opacity: 0.9,
        color: 0xffffff
    });

    const new_transform = transform.deep_copy();
    new_transform.translation = new float3(new_transform.translation.x,new_transform.translation.y,new_transform.translation.z - 0.01);

    return {
        id: "",
        transform : new_transform,
        mesh : new Mesh(geometry, material),
    }
}
