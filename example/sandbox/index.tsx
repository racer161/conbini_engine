import { ColliderDesc, RigidBodyType } from "@dimforge/rapier3d";
import * as THREE from "three";
import { World } from "../../src/core/World";
import { float3 } from "../../src/primitives";
import { LeftHandEntity, RightHandEntity } from "../../src/shapes/HandEntity";
import { Transform } from "../../src/primitives/Transform";
import { Transformation, TransformComponent } from "../../src/impl/Transformation";
import { Quaternion } from "../../src/primitives/Quaternion";
import { Entity } from "../../src/core/Entity";
import { sphere } from "../../src/shapes/sphere";
import { cube } from "../../src/shapes/cube";
import { ConbiniUIDocument, drawJSXToCanvas } from "../../src/ui/ConbiniUIDocument";
import React from "react";
import { System } from "../../src/core/System";
import { XRInput } from "../../src/impl/Input/XRInput";
import { Render } from "../../src/impl/Renderer";
import { RigidbodySystem, RigidbodyEntity } from "../../src/impl/Physics";
import { Collision } from "../../src/impl/Collision";
import { UI, UIComponent, UIEntity } from "../../src/impl/UI";
import { ui } from "../../src/shapes/ui";

function sandbox(width : number, height : number): Entity[]
{
  return[
    cube(width, 0.1, width, 0xffff00, RigidBodyType.Fixed, Transform.fromPositionRotationScale(new float3(0, height, 0), Quaternion.identity, float3.one)),//Floor

    cube(0.1, 0.1, width, 0xff0000, RigidBodyType.Fixed, Transform.fromPositionRotationScale(new float3(width/2, 0.1 + height, 0), Quaternion.identity, float3.one)),
    cube(0.1, 0.1, width, 0xff0000, RigidBodyType.Fixed, Transform.fromPositionRotationScale(new float3(-(width/2), 0.1 + height, 0), Quaternion.identity, float3.one)),

    cube(width, 0.1, 0.1, 0xff0000, RigidBodyType.Fixed, Transform.fromPositionRotationScale(new float3(0, 0.1 + height, -(width/2)), Quaternion.identity, float3.one)),
    cube(width, 0.1, 0.1, 0xff0000, RigidBodyType.Fixed, Transform.fromPositionRotationScale(new float3(0, 0.1 + height, width/2), Quaternion.identity, float3.one)),

    /*sphere(0.1, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3(1, 0.1 + height, 0), Quaternion.identity, float3.one)),
    sphere(0.05, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3(.5, 0.1 + height, 0), Quaternion.identity, float3.one)),
    sphere(0.05, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3(.6, 0.1 + height, 0), Quaternion.identity, float3.one)),
    sphere(0.05, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3(.7, 0.1 + height, 0), Quaternion.identity, float3.one)),
    sphere(0.05, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3(.8, 0.1 + height, 0), Quaternion.identity, float3.one)),
    sphere(0.05, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3(.9, 0.1 + height, 0), Quaternion.identity, float3.one)),
    sphere(0.05, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3(.6, 0.1 + height, .2), Quaternion.identity, float3.one)),*/
    
  ]

}

async function main()
{
  const sandbox_entities = sandbox(5, 0.5);

  const ball = sphere(0.05, 0x0000ff,16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3(0, 5, 0), Quaternion.identity, float3.one));

  const gltf_import = await Entity.from_gltf_loader("60s_office_props/");

  ball.transform.translation = new float3(0,5,0);

  const ui = await ui_test();

  var scene_array : Entity[] = [
    ball,
    ...sandbox_entities,
    ...LeftHandEntity,
    ...RightHandEntity,
    gltf_import,
    ...ui
  ];

  const scene = new World(getSystemArray);
  await scene.init(scene_array);

}

const getSystemArray = (world : World) : System<any>[] => 
[
  new Transformation(world),
  new Render(world),
  new RigidbodySystem(world),
  new XRInput(world),
  new UI(world)
];

main();



export function TestUI(): JSX.Element
{
  const [text, setText] = React.useState("Hello Conbini");

  return(
    <div className="flex w-96 h-96 p-8 ">
      <div className="flex items-center justify-center font-semibold w-48 h-48 bg-gray-300 rounded-xl text-gray-600 m-2 filter drop-shadow-lg hover:bg-blue-500" onClick={() => setText("I'm clicked real good!!")}>
        <div>{ text}</div>
      </div>
    </div>
  );
}





async function ui_test()
{
  const doc = new ConbiniUIDocument(<TestUI/>, 400, 400);
  await doc.init();
  return ui(Transform.fromPositionRotationScale(new float3(0,1,0), Quaternion.identity, float3.one), doc);
  
}

//TODO: Get Tailwind working 
//Then get react working?
//maybe split Conbini UI into a separate repo?


//ui_test();

