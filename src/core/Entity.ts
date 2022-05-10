import { Ball, ColliderDesc, ConvexPolyhedron, RigidBodyDesc, RigidBodyType } from "@dimforge/rapier3d";
import { Document, Material, Primitive, Texture, WebIO } from "@gltf-transform/core";
import { transform } from "lodash";
import * as THREE from "three";
import { BufferAttribute, BufferGeometry, Mesh, MeshStandardMaterial, Scene } from "three";
import { ColliderComponent, RigidbodyEntity } from "../impl/Physics";
import { RenderEntity } from "../impl/Renderer";
import { Transform } from "../primitives/Transform";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { float3 } from "../primitives";
import { Quaternion } from "../primitives/Quaternion";
import { CollisionSubscriberComponent } from "../impl/Collision";
import { transcode } from "buffer";
import { LocalTransformComponent, ParentComponent, ParentEntity, TransformComponent } from "../impl/Transformation";

export interface Entity{
    id: string; //TODO: in order for networked physics to work these ids need to be deterministic so they can be matched to their appropriate rigidbody uuid
    name?: string;
}

const loader = new GLTFLoader();
const base_path = '/assets/models/';

//A class for reading in and managing a glTF document.
export namespace Entity
{
    export async function from_gltf_loader(url : string) : Promise<Entity>
    {
        return new Promise<Entity>((resolve, reject) => {
            loader.setPath(base_path + url);

            loader.load( "scene.gltf", function ( gltf ) {

                resolve(from_three_object_recursive(gltf.scene, false));

            }, undefined, reject);
        });

    }

    function from_three_object_recursive(object : THREE.Object3D, parent? : boolean) : Entity
    {   
        const children : Array<TransformComponent & LocalTransformComponent & Entity> = [];

        object.children.forEach((child : THREE.Object3D) => {
            children.push(from_three_object_recursive(child, true) as TransformComponent & LocalTransformComponent & Entity);
        });

        const entity = from_three_object(object, parent, children);

        return entity;
    }

    //TODO: add physics at some point?
    export function from_three_object(three_object: THREE.Object3D<THREE.Event> & { geometry?: THREE.BufferGeometry, material? : THREE.Material },parent: boolean, children? : Array<TransformComponent & LocalTransformComponent & Entity>, ): Entity
    {   
        const rigidbodyDesc = new RigidBodyDesc(RigidBodyType.Dynamic);

        const local_transform = Transform.fromMatrix4(three_object.matrix);
        const world_transform = Transform.fromMatrix4(three_object.matrixWorld);

        //TODO: add back the collider
        var fin_entity : Entity & TransformComponent = {
            id: undefined,
            name: three_object.name,
            transform : world_transform,
            //rigidbody : undefined,
            //rigidBodyDesc : rigidbodyDesc,
        };

        if(three_object.material && three_object.geometry)
        {
            (fin_entity as unknown as RenderEntity).mesh = new Mesh(three_object.geometry, three_object.material);
            
            //colliderDesc = ColliderDesc.convexHull(three_object.geometry.attributes.position.array as Float32Array);
        }

        if(children)
        {
            (fin_entity as unknown as ParentComponent ).children = children;
            (fin_entity as unknown as ParentComponent).needs_transform_update = true;
        }

        if(parent)
        {
            (fin_entity as unknown as LocalTransformComponent).local_transform = local_transform;
        }

        return fin_entity;
    }

    export function inOrderTreeTraversal(entity : Entity & ParentEntity, callback : (e : Entity) => void ) : void
    {
        callback(entity);
        const children = entity.children;
        if(children)
        {
            for(let i = 0; i < children.length; i++)
            {
                const child = children[i];
                inOrderTreeTraversal(child as unknown as Entity & ParentEntity, callback);
            }
        }
    }
    
}