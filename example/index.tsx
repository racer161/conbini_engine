import { ColliderDesc } from "@dimforge/rapier3d";
import * as THREE from "three";
import { h } from "../src/engine/JSX";
import { Sandbox } from "../src/engine/Sandbox";
import { float3 } from "../src/primitives";
import { LeftHandEntity, RightHandEntity } from "../src/impl/Hand";
import { Transform } from "../src/primitives/Transform";
import { Quaternion } from "../src/primitives/Quaternion";

const Ball = <entity transform={Transform.fromPositionRotationScale(new float3(0,5,0))} collider={ColliderDesc.ball(0.1)} mesh geometry={new THREE.SphereGeometry( 0.1 ,8, 8)} material={new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } )} rigidbody />;

const Floor = <entity static rigidbody transform={Transform.fromPositionRotationScale(new float3(0,0,0), Quaternion.fromEulerXYZ(0,0,0), new float3(1,1,1))} collider={ColliderDesc.cuboid(2.5, 0.1, 2.5)} mesh geometry={new THREE.BoxGeometry( 5, 0.1, 5 )} material={new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide})}  />;



const scene_xml = (
    <root enable_xr={true}>
      <Ball/>
      <Floor/>
      <RightHandEntity/>
      <LeftHandEntity/>
    </root>
);

const scene = new Sandbox(scene_xml);