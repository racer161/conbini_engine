import { RigidBodyType } from "@dimforge/rapier3d";
import { Entity } from "../../src/core/Entity";
import { System } from "../../src/core/System";
import { World } from "../../src/core/World";
import { HandInput } from "../../src/impl/Input/HandInput";
import { Physics } from "../../src/impl/Physics";
import { Render } from "../../src/impl/Renderer";
import { Transformation } from "../../src/impl/Transformation";
import { UI } from "../../src/impl/UI";
import { Quest2Controllers } from "../../src/shapes/ControllerEntity";
import { cube } from "../../src/shapes/cube";

async function main()
{

    const default_cube = cube(1,1,1, 0xffffff, RigidBodyType.Fixed);

    const controllers = await Quest2Controllers();

    var scene_array : Entity[] = [
        default_cube,
        controllers
    ];

    const scene = new World(getSystemArray);
    await scene.init(scene_array);

}

const getSystemArray = (world : World) : System<any>[] => 
[
  new Transformation(world),
  new Render(world),
  new Physics(world),
  new UI(world)
];

main();