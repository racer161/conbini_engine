import { ColliderDesc } from "@dimforge/rapier3d";
import * as THREE from "three";
import { h } from "../src/engine/JSX";
import { Sandbox } from "../src/engine/Sandbox";
import { float3 } from "../src/primitives";
import { HandEntity } from "../src/impl/Hand";
import { Transform } from "../src/primitives/Transform";

const Ball = <entity transform={new Transform()} collider={ColliderDesc.ball(0.5)} mesh geometry={new THREE.SphereGeometry( 0.5 ,16, 16)} material={new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } )} rigidbody />;

const Floor = <entity static transform={new Transform()} collider={ColliderDesc.cuboid(10, 0.1, 10).setRotation({x : 1, y : 1, z: 1, w: 0})} mesh geometry={new THREE.PlaneGeometry( 10, 10 ).rotateX( - Math.PI / 2 + 0.4 )} material={new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide})}  />;

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