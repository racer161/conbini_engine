import { ColliderDesc } from "@dimforge/rapier3d";
import * as THREE from "three";
import { h } from "../src/engine/JSX";
import { Sandbox } from "../src/engine/Sandbox";
import { float3 } from "../src/primitives";
import { HandEntity } from "../src/impl/Hand";
import { Transform } from "../src/primitives/Transform";
import { Quaternion } from "../src/primitives/Quaternion";

const Ball = <entity transform={new Transform(new float3(0,5,0))} collider={ColliderDesc.ball(0.5)} mesh geometry={new THREE.SphereGeometry( 0.5 ,8, 8)} material={new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } )} rigidbody />;

const Floor = <entity static rigidbody transform={new Transform(new float3(0,-1,0), Quaternion.fromEulerXYZ(0,0,90), new float3(1,1,1))} collider={ColliderDesc.cuboid(2.5, 0.1, 2.5)} mesh geometry={new THREE.BoxGeometry( 5, 0.1, 5 )} material={new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide})}  />;



const scene_xml = (
    <root enable_xr={true}>
      <Ball/>
      <Floor/>
    </root>
);

const scene = new Sandbox(scene_xml);