import { ColliderDesc, RigidBodyType } from "@dimforge/rapier3d";
import * as THREE from "three";
import { h } from "../src/engine/JSX";
import { Sandbox } from "../src/engine/Sandbox";
import { float3 } from "../src/primitives";
import { LeftHandEntity, RightHandEntity } from "../src/impl/Hand";
import { Transform } from "../src/primitives/Transform";
import { Quaternion } from "../src/primitives/Quaternion";

const s_width = 2; 

const Ball = <entity rigidbody_type={RigidBodyType.Dynamic} mass={1} transform={Transform.fromPositionRotationScale(new float3(0,5,0))} collider={ColliderDesc.ball(0.1).setRestitution(0.5)} mesh geometry={new THREE.SphereGeometry( 0.1 ,32, 32)} material={new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } )} rigidbody />;

const Floor = <entity rigidbody_type={RigidBodyType.Fixed} rigidbody transform={Transform.fromPositionRotationScale(new float3(0,0,0), Quaternion.fromEulerXYZ(0,0,0), new float3(1,1,1))} collider={ColliderDesc.cuboid(2.5, 0.1, 2.5)} mesh geometry={new THREE.BoxGeometry( 5, 0.1, 5 )} material={new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide})}  />;

const sandbox_with_walls =(
  <div>
    <entity rigidbody_type={RigidBodyType.Fixed} rigidbody transform={Transform.fromPositionRotationScale(new float3(0,0,0), Quaternion.fromEulerXYZ(0,0,0), new float3(1,1,1))} collider={ColliderDesc.cuboid(s_width/2, 0.1, s_width/2)} mesh geometry={new THREE.BoxGeometry( s_width, 0.2, s_width )} material={new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide})}  />
    <entity rigidbody_type={RigidBodyType.Fixed} rigidbody transform={Transform.fromPositionRotationScale(new float3(0,.2,-(s_width/2)), Quaternion.fromEulerXYZ(0,0,0), new float3(1,1,1))} collider={ColliderDesc.cuboid(s_width/2, 0.1, 0.1)} mesh geometry={new THREE.BoxGeometry( s_width, 0.2, 0.2 )} material={new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide})}  />
    <entity rigidbody_type={RigidBodyType.Fixed} rigidbody transform={Transform.fromPositionRotationScale(new float3(0,.2,s_width/2), Quaternion.fromEulerXYZ(0,0,0), new float3(1,1,1))} collider={ColliderDesc.cuboid(s_width/2, 0.1, 0.1)} mesh geometry={new THREE.BoxGeometry( s_width, 0.2, 0.2 )} material={new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide})}  />

    <entity rigidbody_type={RigidBodyType.Fixed} rigidbody transform={Transform.fromPositionRotationScale(new float3(-(s_width/2),.2,0), Quaternion.fromEulerXYZ(0,0,0), new float3(1,1,1))} collider={ColliderDesc.cuboid(0.1, 0.1, s_width/2)} mesh geometry={new THREE.BoxGeometry( 0.2, 0.2, s_width )} material={new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide})}  />
    <entity rigidbody_type={RigidBodyType.Fixed} rigidbody transform={Transform.fromPositionRotationScale(new float3(s_width/2,.2,0), Quaternion.fromEulerXYZ(0,0,0), new float3(1,1,1))} collider={ColliderDesc.cuboid(0.1, 0.1, s_width/2)} mesh geometry={new THREE.BoxGeometry( 0.2, 0.2, s_width )} material={new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide})}  />
  </div>
);


const scene_xml = (
  <root enable_xr={true}>
    {Ball}
    {sandbox_with_walls}
    <RightHandEntity/>
    <LeftHandEntity/>
  </root>
);

const scene = new Sandbox(scene_xml);

