import { ColliderDesc, RigidBodyType } from "@dimforge/rapier3d";
import * as THREE from "three";
import { h } from "../src/engine/JSX";
import { Scene } from "../src/engine/Scene";
import { float3 } from "../src/primitives";
import { LeftHandEntity, RightHandEntity } from "../src/impl/Hand";
import { Transform } from "../src/primitives/Transform";
import { Quaternion } from "../src/primitives/Quaternion";
import { Entity } from "../src/core/Entity";
import { sphere } from "../src/shapes/sphere";
import { cube } from "../src/shapes/cube";


const ball = sphere(0.1, 0x0000ff,16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3([0, 5, 0]), Quaternion.identity, float3.one));

ball.transform.setTranslation(new float3([0,5,0]));



function sandbox(width : number): Entity[]
{
  return[
    cube(width, 0.1, width, 0xffff00, RigidBodyType.Fixed),//Floor

    cube(0.1, 0.1, width, 0xff0000, RigidBodyType.Fixed, Transform.fromPositionRotationScale(new float3([width/2, 0.1, 0]), Quaternion.identity, float3.one)),
    cube(0.1, 0.1, width, 0xff0000, RigidBodyType.Fixed, Transform.fromPositionRotationScale(new float3([-(width/2), 0.1, 0]), Quaternion.identity, float3.one)),

    cube(width, 0.1, 0.1, 0xff0000, RigidBodyType.Fixed, Transform.fromPositionRotationScale(new float3([0, 0.1, -(width/2)]), Quaternion.identity, float3.one)),
    cube(width, 0.1, 0.1, 0xff0000, RigidBodyType.Fixed, Transform.fromPositionRotationScale(new float3([0, 0.1, width/2]), Quaternion.identity, float3.one)),
  ]

}

//TODO: Make a better Enity Array Class with convenient methods
var scene_array : Entity[] = [
  ball,
  ...sandbox(2),
  ...LeftHandEntity,
  ...RightHandEntity
];




const scene = new Scene(scene_array);

