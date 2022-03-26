import { World, Vector, ColliderDesc, RigidBody } from '@dimforge/rapier3d';

const QUEST_2_DEFAULT_WEBXR_FPS = 90.0;

export default class RapierPhysics
{
    //wasm object holder
    private RAPIER: object;

    gravity: Vector;
    world: World;

    constructor(rapier: object){
        this.RAPIER = rapier;
        this.gravity = { x: 0.0, y: -9.81, z: 0.0 };
        this.world = new World(this.gravity);
        this.world.timestep = 1.0 / QUEST_2_DEFAULT_WEBXR_FPS;
    }

    take_snapshot() : Uint8Array
    {
        return this.world.takeSnapshot();
    }

    static async fromWASM() : Promise<RapierPhysics>
    {
        const RAPIER = await import('@dimforge/rapier3d');
        return new RapierPhysics(RAPIER);
    }

    async step(){
        this.world.step();
    }

}