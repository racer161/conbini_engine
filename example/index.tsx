import { ColliderDesc } from "@dimforge/rapier3d";
import * as THREE from "three";
import { h } from "../src/engine/JSX";
import { Sandbox } from "../src/engine/Sandbox";
import { float3 } from "../src/primitives";

const Ball = <entity position={float3.from([1, 3, 1])} collider={ColliderDesc.ball(0.5)} mesh geometry={new THREE.SphereGeometry( 0.5 ,16, 16)} material={new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } )} rigidbody />;

const Floor = <entity static position={float3.from([0, 0, 0])} collider={ColliderDesc.cuboid(10, 0.1, 10).setRotation({x : 1, y : 1, z: 1, w: 0})} mesh geometry={new THREE.PlaneGeometry( 10, 10 ).rotateX( - Math.PI / 2 + 0.4 )} material={new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide})}  />;

const scene_xml = (
    <root enable_xr={true}>
      <Ball/>
      <Floor/>
    </root>
);

const scene = new Sandbox(scene_xml);