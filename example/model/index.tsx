import { RigidBodyType } from "@dimforge/rapier3d";
import { Entity } from "../../src/core/Entity";
import { System } from "../../src/core/System";
import { World } from "../../src/core/World";
import { EditorControls } from "../../src/impl/Editor/EditorControls";
import { KeyboardInputSystem } from "../../src/impl/Input/KeyboardInputSystem";
import { XRInput } from "../../src/impl/Input/XRInput";
import { ColliderSystem, JointSystem, RigidbodySystem } from "../../src/impl/Physics";
import { Render } from "../../src/impl/Renderer";
import { Transformation } from "../../src/impl/Transformation";
import { UI } from "../../src/impl/UI";
import { Quest2Controllers } from "../../src/shapes/ControllerEntity";
import { cube } from "../../src/shapes/cube";

async function main()
{
  const default_cube = cube(1,1,1, 0xffffff, RigidBodyType.Fixed);

  const controllers = await Quest2Controllers;

  var scene_array : Entity[] = [
    default_cube,
    ...controllers,
  ];

  const scene = new World(getSystemArray);
  await scene.init(scene_array);

}

const getSystemArray = (world : World) : System<any>[] => 
[
  new KeyboardInputSystem(world),
  new Transformation(world),
  new Render(world),
  new EditorControls(world),
  new RigidbodySystem(world),
  new ColliderSystem(world),
  new JointSystem(world),
  new XRInput(world),
  new UI(world)
];

main();

//TODO: Flying Locomotion
//TODO: Raycast Vertex Selection
//TODO: Selected Vertex Transformation