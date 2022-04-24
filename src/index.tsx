import { ColliderDesc, RigidBodyType } from "@dimforge/rapier3d";
import * as THREE from "three";
import { Scene } from "./core/Scene";
import { float3 } from "./primitives";
import { LeftHandEntity, RightHandEntity } from "./impl/HandEntity";
import { Transform } from "./primitives/Transform";
import { Quaternion } from "./primitives/Quaternion";
import { Entity } from "./core/Entity";
import { sphere } from "./shapes/sphere";
import { cube } from "./shapes/cube";
import { drawJSXToCanvas } from "./impl/UI";


function sandbox(width : number, height : number): Entity[]
{
  return[
    cube(width, 0.1, width, 0xffff00, RigidBodyType.Fixed, Transform.fromPositionRotationScale(new float3([0, height, 0]), Quaternion.identity, float3.one)),//Floor

    cube(0.1, 0.1, width, 0xff0000, RigidBodyType.Fixed, Transform.fromPositionRotationScale(new float3([width/2, 0.1 + height, 0]), Quaternion.identity, float3.one)),
    cube(0.1, 0.1, width, 0xff0000, RigidBodyType.Fixed, Transform.fromPositionRotationScale(new float3([-(width/2), 0.1 + height, 0]), Quaternion.identity, float3.one)),

    cube(width, 0.1, 0.1, 0xff0000, RigidBodyType.Fixed, Transform.fromPositionRotationScale(new float3([0, 0.1 + height, -(width/2)]), Quaternion.identity, float3.one)),
    cube(width, 0.1, 0.1, 0xff0000, RigidBodyType.Fixed, Transform.fromPositionRotationScale(new float3([0, 0.1 + height, width/2]), Quaternion.identity, float3.one)),

    sphere(0.1, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3([1, 0.1 + height, 0]), Quaternion.identity, float3.one)),
    sphere(0.05, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3([.5, 0.1 + height, 0]), Quaternion.identity, float3.one)),
    sphere(0.05, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3([.6, 0.1 + height, 0]), Quaternion.identity, float3.one)),
    sphere(0.05, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3([.7, 0.1 + height, 0]), Quaternion.identity, float3.one)),
    sphere(0.05, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3([.8, 0.1 + height, 0]), Quaternion.identity, float3.one)),
    sphere(0.05, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3([.9, 0.1 + height, 0]), Quaternion.identity, float3.one)),
    sphere(0.05, 0x00ff00, 16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3([.6, 0.1 + height, .2]), Quaternion.identity, float3.one)),
    
  ]

}

async function main()
{
  const ball = sphere(0.05, 0x0000ff,16, RigidBodyType.Dynamic, Transform.fromPositionRotationScale(new float3([0, 5, 0]), Quaternion.identity, float3.one));

  const helmet = await Entity.from_gltf_loader("DamagedHelmet.glb");
  helmet.transform.setTranslation(new float3([0, 5, 0]));
  helmet.transform.setScale(new float3([0.1, 0.1, 0.1]));

  ball.transform.setTranslation(new float3([0,5,0]));

  //TODO: Make a better Enity Array Class with convenient methods
  var scene_array : Entity[] = [
    ball,
    ...sandbox(2, 0.5),
    ...LeftHandEntity,
    ...RightHandEntity,
    helmet
  ];

  const scene = new Scene(scene_array);
}

//main();

import React from "react";

export function test_ui(): JSX.Element
{
    return(
      <div className="flex w-full h-full p-8">
        <div className="flex items-center justify-center w-48 h-48 bg-gray-300 rounded-xl text-gray-600 m-2 filter drop-shadow-lg">
          <div>Hello Conbini</div>
        </div>
        <div className="flex items-center justify-center w-48 h-48 bg-gray-300 rounded-xl text-gray-600 m-2 filter drop-shadow-lg">
          <div>Hello Conbini</div>
        </div>
        <div className="flex items-center justify-center w-48 h-48 bg-gray-300 rounded-xl text-gray-600 m-2 filter drop-shadow-lg">
          <div>Hello Conbini</div>
        </div>
        <div className="flex items-center justify-center w-48 h-48 bg-gray-300 rounded-xl text-gray-600 m-2 filter drop-shadow-lg">
          <div>Hello Conbini</div>
        </div>
        <div className="flex items-center justify-center w-48 h-48 bg-gray-300 rounded-xl text-gray-600 m-2 filter drop-shadow-lg">
          <div>Hello Conbini</div>
        </div>
        <div className="flex items-center justify-center w-48 h-48 bg-gray-300 rounded-xl text-gray-600 m-2 filter drop-shadow-lg">
          <div>Hello Conbini</div>
        </div>
      </div>

    );
}

function backingScale() {
  if (window.devicePixelRatio && window.devicePixelRatio > 1) {
      return window.devicePixelRatio;
  }
  return 1;
}

function scaleCanvasForRetina(canvas : HTMLCanvasElement, width? : number, height? : number) {
  var scaleFactor = backingScale();
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  canvas.width = width * scaleFactor;
  canvas.height = height * scaleFactor;
}

async function ui_test()
{
  const canvas = document.createElement("canvas");
  scaleCanvasForRetina(canvas, 400, 400);

  canvas.addEventListener("mousedown", function(e)
  {
      getMousePosition(canvas, e);
  });


  document.body.appendChild(canvas);

  var array = [];

  for(let i = 0; i < 10; i++){
    array.push(await drawJSXToCanvas(test_ui(), canvas, backingScale()));
  }

  console.log(array);
    
}

//TODO: Get Tailwind working 
//Then get react working?
//maybe split Conbini UI into a separate repo?


ui_test();

function getMousePosition(canvas : HTMLCanvasElement, event : MouseEvent){
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  console.log("Coordinate x: " + x, 
              "Coordinate y: " + y);
}