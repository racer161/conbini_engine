import { RigidBodyType } from "@dimforge/rapier3d";
import { Document, Material, Primitive, Texture, WebIO } from "@gltf-transform/core";
import { transform } from "lodash";
import * as THREE from "three";
import { BufferAttribute, BufferGeometry, Mesh, MeshStandardMaterial } from "three";
import { PhysicsEntity } from "../impl/Physics";
import { RenderEntity } from "../impl/Renderer";
import { Transform } from "../primitives/Transform";

export interface Entity{
    children?: Entity[];
    id: string;
    name?: string;
}

export interface Static
{
    static?: boolean;
}

// https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#default-material
const DEFAULT_MATERIAL = new MeshStandardMaterial({color: 0xFFFFFF, roughness: 1.0, metalness: 1.0, side: THREE.FrontSide});

const io = new WebIO({credentials: 'include'});

//A class for reading in and managing a glTF document.
export namespace Entity
{
    export async function from_glb_url(url : string, transform? : Transform): Promise<Entity & RenderEntity & PhysicsEntity>
    {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();

        return to_entity(await io.readBinary(new Uint8Array(buffer)), transform);
    }

    export async function from_glb_buffer(buffer : ArrayBuffer, transform? : Transform): Promise<Entity & RenderEntity & PhysicsEntity>
    {
        return to_entity(await io.readBinary(new Uint8Array(buffer)), transform);
    }

    //TODO: Create an function that reads the properties from this.document and exports an Entity
    //TODO: HardCode this with Three.js Geometry and Material for now
    export async function to_entity(document : Document, transform? : Transform): Promise<Entity & RenderEntity & PhysicsEntity>
    {
        const root = document.getRoot();

        const node = root.listNodes()[0];
        const node_mesh = node.getMesh();
        const primitive = node_mesh.listPrimitives()[0];

        const material = await getTHREEMaterialFromMaterial(primitive.getMaterial());

        const geometry = getTHREEGeometryFromPrimitive(primitive);

        const mesh = new Mesh(geometry, material);

        //geometry.setAttribute('position', new BufferAttribute(root.getBufferView('POSITION'), 3));

        return {
            id: undefined,
            name: root.getName(),
            transform : transform ? transform : new Transform(),
            mesh : mesh,
            rigidbody : undefined,
            rigidbody_type : RigidBodyType.Fixed,
            gravity_coefficient : undefined
        };
    }
    
}


function getTHREEGeometryFromPrimitive(primitive : Primitive)
{
    const geometry = new BufferGeometry();

    //set the position indices
    const index_attribute = primitive.getIndices();

    const buffer_attribute = new BufferAttribute(index_attribute.getArray(), index_attribute.getElementSize());
    geometry.setIndex(buffer_attribute);

    //for each attribute name in the primitive
    primitive.listSemantics().map(attribute_name => {
        //get the raw attribute
        const attribute = primitive.getAttribute(attribute_name);
        //assign it to the geometry

        const attribute_name_to_set = semanticToAttributeName(attribute_name);
        console.log(attribute_name_to_set);
        geometry.setAttribute(
            attribute_name_to_set, 
            new BufferAttribute(attribute.getArray(), attribute.getElementSize()) //Copy it into a buffer that can be uploaded to the GPU
        );
    });

    

    return geometry;
}

async function getTHREEMaterialFromMaterial(mat : Material) : Promise<THREE.Material>
{
    const material = DEFAULT_MATERIAL.clone();

    material.map = await getTHREETextureFromGLTFTexture(mat.getBaseColorTexture(), true);
    const base_color_factor = mat.getBaseColorFactor();
    material.color = new THREE.Color(base_color_factor[0], base_color_factor[1], base_color_factor[2]);

    material.name = mat.getName();
    material.transparent = mat.getAlphaMode() === 'BLEND' || mat.getAlphaMode() === 'MASK';
    material.envMapIntensity = 1.0;


    material.metalness = mat.getMetallicFactor();
    material.roughness = mat.getRoughnessFactor();

    material.roughnessMap = await getTHREETextureFromGLTFTexture(mat.getMetallicRoughnessTexture());

    material.normalMap = await getTHREETextureFromGLTFTexture(mat.getNormalTexture());

    material.metalnessMap = await getTHREETextureFromGLTFTexture(mat.getMetallicRoughnessTexture());

    return material;
}

async function getTHREETextureFromGLTFTexture(gltf_texture : Texture, sRGB : boolean = false) : Promise<THREE.Texture>
{
    const blob = new Blob([gltf_texture.getImage()], { type: gltf_texture.getMimeType() });
    const imageURL = URL.createObjectURL(blob);

    const texture = new THREE.TextureLoader().load( imageURL );
    if(sRGB) texture.encoding = THREE.sRGBEncoding;

    texture.flipY = false;
    texture.premultiplyAlpha = false;
    texture.mapping = THREE.UVMapping;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    return texture;
}


function semanticToAttributeName(semantic: string): string {
	switch (semantic) {
		case 'POSITION': return 'position';
		case 'NORMAL': return 'normal';
		case 'TANGENT': return 'tangent';
		case 'COLOR_0': return 'color';
		case 'JOINTS_0': return 'skinIndex';
		case 'WEIGHTS_0': return 'skinWeight';
		case 'TEXCOORD_0': return 'uv';
		case 'TEXCOORD_1': return 'uv2';
		default: return '_' + semantic.toLowerCase();
	}
}