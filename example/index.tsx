import * as THREE from "three";
import { h } from "../src/engine/JSX";
import { Sandbox } from "../src/engine/Sandbox";
import { float3 } from "../src/primitives";

const Box = <entity position={float3.from([1, 2, 1])} mesh geometry={new THREE.BoxGeometry( 0.5, 0.5, 0.5 )} material={new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } )} rigidbody />;

const scene_xml = (
    <root enable_xr={true}>
      <Box/>
    </root>
);

console.log(scene_xml);

const scene = new Sandbox(scene_xml);