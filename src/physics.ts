import { World, Vector, ColliderDesc } from '@dimforge/rapier3d';

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
    }

    static async fromWASM(){
        const RAPIER = await import('@dimforge/rapier3d');
        return new RapierPhysics(RAPIER);
    }

    update(deltaTime: number){
        this.world.step();
    }

}