import { ColliderDesc, RigidBodyType } from "@dimforge/rapier3d";
import * as THREE from "three";
import { Scene } from "../src/core/Scene";
import { float3 } from "../src/primitives";
import { LeftHandEntity, RightHandEntity } from "../src/impl/Hand";
import { Transform } from "../src/primitives/Transform";
import { Quaternion } from "../src/primitives/Quaternion";
import { Entity } from "../src/core/Entity";
import { sphere } from "../src/shapes/sphere";
import { cube } from "../src/shapes/cube";


const ball = sphere(0.05, 0x0000ff,16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3([0, 5, 0]), Quaternion.identity, float3.one));

ball.transform.setTranslation(new float3([0,5,0]));



function sandbox(width : number, height : number): Entity[]
{
  return[
    cube(width, 0.1, width, 0xffff00, RigidBodyType.Fixed, Transform.fromPositionRotationScale(new float3([0, height, 0]), Quaternion.identity, float3.one)),//Floor

    cube(0.1, 0.1, width, 0xff0000, RigidBodyType.Fixed, Transform.fromPositionRotationScale(new float3([width/2, 0.1 + height, 0]), Quaternion.identity, float3.one)),
    cube(0.1, 0.1, width, 0xff0000, RigidBodyType.Fixed, Transform.fromPositionRotationScale(new float3([-(width/2), 0.1 + height, 0]), Quaternion.identity, float3.one)),

    cube(width, 0.1, 0.1, 0xff0000, RigidBodyType.Fixed, Transform.fromPositionRotationScale(new float3([0, 0.1 + height, -(width/2)]), Quaternion.identity, float3.one)),
    cube(width, 0.1, 0.1, 0xff0000, RigidBodyType.Fixed, Transform.fromPositionRotationScale(new float3([0, 0.1 + height, width/2]), Quaternion.identity, float3.one)),

    sphere(0.1, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3([1, 0.1 + height, 0]), Quaternion.identity, float3.one)),
    sphere(0.05, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3([.5, 0.1 + height, 0]), Quaternion.identity, float3.one)),
    sphere(0.05, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3([.6, 0.1 + height, 0]), Quaternion.identity, float3.one)),
    sphere(0.05, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3([.7, 0.1 + height, 0]), Quaternion.identity, float3.one)),
    sphere(0.05, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3([.8, 0.1 + height, 0]), Quaternion.identity, float3.one)),
    sphere(0.05, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3([.9, 0.1 + height, 0]), Quaternion.identity, float3.one)),
    sphere(0.05, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3([.6, 0.1 + height, .2]), Quaternion.identity, float3.one)),
  ]

}

//TODO: Make a better Enity Array Class with convenient methods
var scene_array : Entity[] = [
  ball,
  ...sandbox(2, 0.5),
  ...LeftHandEntity,
  ...RightHandEntity
];




const scene = new Scene(scene_array);

