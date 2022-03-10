import { ColliderDesc } from "@dimforge/rapier3d";
import * as THREE from "three";
import { h } from "../src/engine/JSX";
import { Sandbox } from "../src/engine/Sandbox";
import { float3 } from "../src/primitives";
import { HandEntity } from "../src/impl/Hand";

const Box = <entity name="blah box" rigidbody position={float3.from([1, 3, 1])} collider={ColliderDesc.cuboid(0.5, 0.5, 0.5)} mesh geometry={new THREE.BoxGeometry( 0.5, 0.5, 0.5 )} material={new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } )} />;

const Floor = <entity static rigidbody position={float3.from([0, 0, 0])} collider={ColliderDesc.cuboid(10, 0.1, 10)} mesh geometry={new THREE.PlaneGeometry( 10, 10 ).rotateX( - Math.PI / 2 )} material={new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide})}  />;

const scene_xml = (
    <root enable_xr={true}>
      <Box/>
      <Floor/>
      <HandEntity/>
    </root>
);

console.log(scene_xml);

const scene = new Sandbox(scene_xml);