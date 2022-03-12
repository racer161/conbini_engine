import { ColliderDesc } from "@dimforge/rapier3d";
import * as THREE from "three";
import { h } from "../src/engine/JSX";
import { Sandbox } from "../src/engine/Sandbox";
import { float3 } from "../src/primitives";
import { HandEntity } from "../src/impl/Hand";
import { Transform } from "../src/primitives/Transform";
import { Quaternion } from "../src/primitives/Quaternion";

const Ball = <entity transform={new Transform()} collider={ColliderDesc.ball(0.5)} mesh geometry={new THREE.SphereGeometry( 0.5 ,16, 16)} material={new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } )} rigidbody />;

const Floor = <entity static transform={new Transform(new float3(0,-1,0))} collider={ColliderDesc.cuboid(10, 0.1, 10)} mesh geometry={new THREE.PlaneGeometry( 10, 10 )} material={new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide})}  />;



const scene_xml = (
    <root enable_xr={true}>
      <Ball/>
      <Floor/>
    </root>
);

const new_t = new float3(1,2,3);

console.log(new_t);

console.log(scene_xml);

const scene = new Sandbox(scene_xml);