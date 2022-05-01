import { ColliderDesc, RigidBodyType } from "@dimforge/rapier3d";
import * as THREE from "three";
import { World } from "./core/World";
import { float3 } from "./primitives";
import { LeftHandEntity, RightHandEntity } from "./shapes/HandEntity";
import { Transform } from "./primitives/Transform";
import { Quaternion } from "./primitives/Quaternion";
import { Entity } from "./core/Entity";
import { sphere } from "./shapes/sphere";
import { cube } from "./shapes/cube";
import { ConbiniUIDocument, drawJSXToCanvas } from "./ui/ConbiniUIDocument";
import React from "react";
import { System } from "./core/System";
import { HandInput } from "./impl/HandInput";
import { Render } from "./impl/Renderer";
import { Physics, PhysicsEntity } from "./impl/Physics";
import { Collision } from "./impl/Collision";
import { UIComponent, UIEntity } from "./impl/UI";
import { ui } from "./shapes/ui";

function sandbox(width : number, height : number): Entity[]
{
  return[
    cube(width, 0.1, width, 0xffff00, RigidBodyType.Fixed, Transform.fromPositionRotationScale(new float3(0, height, 0), Quaternion.identity, float3.one)),//Floor

    cube(0.1, 0.1, width, 0xff0000, RigidBodyType.Fixed, Transform.fromPositionRotationScale(new float3(width/2, 0.1 + height, 0), Quaternion.identity, float3.one)),
    cube(0.1, 0.1, width, 0xff0000, RigidBodyType.Fixed, Transform.fromPositionRotationScale(new float3(-(width/2), 0.1 + height, 0), Quaternion.identity, float3.one)),

    cube(width, 0.1, 0.1, 0xff0000, RigidBodyType.Fixed, Transform.fromPositionRotationScale(new float3(0, 0.1 + height, -(width/2)), Quaternion.identity, float3.one)),
    cube(width, 0.1, 0.1, 0xff0000, RigidBodyType.Fixed, Transform.fromPositionRotationScale(new float3(0, 0.1 + height, width/2), Quaternion.identity, float3.one)),

    sphere(0.1, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3(1, 0.1 + height, 0), Quaternion.identity, float3.one)),
    sphere(0.05, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3(.5, 0.1 + height, 0), Quaternion.identity, float3.one)),
    sphere(0.05, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3(.6, 0.1 + height, 0), Quaternion.identity, float3.one)),
    sphere(0.05, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3(.7, 0.1 + height, 0), Quaternion.identity, float3.one)),
    sphere(0.05, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3(.8, 0.1 + height, 0), Quaternion.identity, float3.one)),
    sphere(0.05, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3(.9, 0.1 + height, 0), Quaternion.identity, float3.one)),
    sphere(0.05, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3(.6, 0.1 + height, .2), Quaternion.identity, float3.one)),
    
  ]

}

async function main()
{
  
  const sandbox_entities = sandbox(2, 0.5);

  const ball = sphere(0.05, 0x0000ff,16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3(0, 5, 0), Quaternion.identity, float3.one));

  const helmet = await Entity.from_gltf_loader("DamagedHelmet.glb", new float3(0.1, 0.1, 0.1), sandbox_entities[0] as unknown as PhysicsEntity);
  helmet.transform.translation = new float3(0, 5, 0);

  console.log(helmet.transform.scale);

  ball.transform.translation = new float3(0,5,0);


  const ui = ui_test();
  

  //TODO: Make a better Enity Array Class with convenient methods
  var scene_array : Entity[] = [
    ball,
    ...sandbox_entities,
    ...LeftHandEntity,
    ...RightHandEntity,
    helmet,
    ui
  ];

  const scene = new World(getSystemArray);
  scene.init(scene_array);

}

const getSystemArray = (world : World) : System<any>[] => 
[
  new Render(world),
  new Physics(world),
  new HandInput(world)
  
];

main();



export function TestUI(): JSX.Element
{
  const [text, setText] = React.useState("Hello Conbini");

  return(
    <div className="flex w-full h-full p-8  bg-white rounded-3xl border-2 ">
      <div className="flex items-center justify-center w-48 h-48 bg-gray-300 rounded-xl text-gray-600 m-2 filter drop-shadow-lg hover:bg-blue-500" onClick={() => setText("I'm clicked real good!!")}>
        <div>{ text}</div>
      </div>
    </div>
  );
}





function ui_test()
{
  const doc = new ConbiniUIDocument(<TestUI/>, 400, 400);

  return ui(Transform.fromPositionRotationScale(new float3(0,1,0), Quaternion.identity, float3.one), doc, 0.3,0.3,0.05);
  
}

//TODO: Get Tailwind working 
//Then get react working?
//maybe split Conbini UI into a separate repo?


//ui_test();

