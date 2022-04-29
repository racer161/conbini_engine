import { Ball, ColliderDesc, ConvexPolyhedron, RigidBodyDesc, RigidBodyType } from "@dimforge/rapier3d";
import { Document, Material, Primitive, Texture, WebIO } from "@gltf-transform/core";
import { transform } from "lodash";
import * as THREE from "three";
import { BufferAttribute, BufferGeometry, Mesh, MeshStandardMaterial } from "three";
import { ColliderComponent, PhysicsEntity } from "../impl/Physics";
import { RenderEntity } from "../impl/Renderer";
import { Transform } from "../primitives/Transform";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { float3 } from "../primitives";
import { Quaternion } from "../primitives/Quaternion";

export interface Entity{
    children?: Entity[];
    id: string; //TODO: in order for networked physics to work these ids need to be deterministic so they can be matched to their appropriate rigidbody uuid
    name?: string;
}

export interface Static
{
    static?: boolean;
}

const loader = new GLTFLoader().setPath('/assets/models/');

// https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#default-material
const DEFAULT_MATERIAL = new MeshStandardMaterial({color: 0xFFFFFF, roughness: 1.0, metalness: 1.0, side: THREE.FrontSide});

const io = new WebIO({credentials: 'include'});

//A class for reading in and managing a glTF document.
export namespace Entity
{
    export async function from_gltf_loader(url : string) : Promise<Entity & RenderEntity & PhysicsEntity & ColliderComponent>
    {
        return new Promise<Entity & RenderEntity & PhysicsEntity & ColliderComponent>((resolve, reject) => {
            loader.load( url, function ( gltf ) {

                gltf.scene.traverse(function(child) {
                    if(child.type === 'Mesh')
                    {
                        resolve(from_three_object(child));
                    }
                });



            }, undefined, reject );
        });

    }

    export function from_three_object(three_object: THREE.Object3D<THREE.Event> & { geometry?: THREE.BufferGeometry, material? : THREE.Material }): Entity & RenderEntity & PhysicsEntity & ColliderComponent
    {

        const mesh = new Mesh(three_object.geometry, three_object.material);

        const rigidbodyDesc = new RigidBodyDesc(RigidBodyType.Dynamic);

        //for some reason rapier doesn't accept a convex hull with index data
        //so we are forced to call the high level API ColliderDesc.convexHull()
        //const shape = new ConvexPolyhedron(three_object.geometry.attributes.position.array as Float32Array, three_object.geometry.index.array as Uint32Array);
        //const colliderDesc = new ColliderDesc(shape);

        const colliderDesc = ColliderDesc.convexHull(three_object.geometry.attributes.position.array as Float32Array);

        return {
            id: undefined,
            name: three_object.name,
            transform : Transform.fromPositionRotationScale(
                new float3(three_object.position.x,three_object.position.y,three_object.position.z ), //translation
                Quaternion.fromEulerXYZ(three_object.rotation.x, three_object.rotation.y, three_object.rotation.z), //rotation
                new float3(three_object.scale.x, three_object.scale.y, three_object.scale.z)),// 
            mesh : mesh,
            rigidbody : undefined,
            rigidBodyDesc : rigidbodyDesc,
            collider : colliderDesc
        };
    }
    
}