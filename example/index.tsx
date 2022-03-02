import * as THREE from "three";
import { h } from "../src/engine/JSX";
import { Scene } from "../src/engine/Scene";
import { float3 } from "../src/primitives";

const Box = <entity position={float3.from([1, 0, 1])} mesh geometry={new THREE.BoxGeometry( 0.2, 0.2, 0.2 )} material={new THREE.MeshNormalMaterial()} rigidbody />;

const scene_xml = (
    <root enable_xr={true}>
      <Box />
    </root>
);

console.log(scene_xml);

const scene = new Scene(scene_xml);

console.log(scene_xml);