import { TempContactManifold, World } from "@dimforge/rapier3d";
import { XRFrame } from "three";
import { keys } from "ts-transformer-keys";
import { Entity } from "../core/Entity";
import { System } from "../core/System";
import { TransformComponent } from "../impl/Transformation";
import { ConbiniUIDocument } from "../ui/ConbiniUIDocument";
import { HandEntity, HandInput } from "./Input/HandInput";
import { Physics, PhysicsEntity, RigidBodyComponent } from "./Physics";
import { MeshComponent } from "./Renderer";


export interface UIComponent
{
    ui_document : ConbiniUIDocument
}

export interface UIEntity extends TransformComponent, RigidBodyComponent, MeshComponent, UIComponent{}

export class UI<T extends UIEntity> extends System<T> 
{
    name: string = "UI";

    archetype: string[] = keys<UIEntity>();

    run_priority: number = 3;

    physics_world: World;

    input_entities: Set<HandEntity>;

    async init_system(): Promise<void>
    {
        const physics = this.world.system_array.find(s => s instanceof Physics) as Physics<PhysicsEntity>;
        this.physics_world = physics.physics.world;
    }

    
    async beforeUpdate(time: number, frame?: XRFrame): Promise<void>{
        if(this.input_entities === undefined)
        {
            this.input_entities = new Set(this.world.getEntitiesByName([
                "thumb-tip-0-sphere", "thumb-tip-1-sphere", //THUMB
                "index-finger-tip-0-sphere", "index-finger-tip-1-sphere", //INDEX
                "middle-finger-tip-0-sphere", "middle-finger-tip-1-sphere",//MIDDLE
                "ring-finger-tip-0-sphere", "ring-finger-tip-1-sphere", //RING
                "pinky-finger-tip-0-sphere", "pinky-finger-tip-1-sphere"//PINKY
            ])) as unknown as Set<HandEntity>;
    
            console.log(this.input_entities);
        }
    }
    
    async update(e: T, time: number, frame?: XRFrame): Promise<void> {
        //throw new Error("Method not implemented.");
        //TODO: implement collision detection or raycasting
        //simulate click when hand touches ui element
        for(let hand of this.input_entities){
            const handle1 = e.rigidbody.collider(0);
            const handle2 = hand.rigidbody.collider(0);

            this.physics_world.contactPair(handle1, handle2, (manifold : TempContactManifold, flipped : boolean) => {
                const contact_point =  flipped ? manifold.localContactPoint2(0) : manifold.localContactPoint1(0);

                //convert this world space contact point into a pixel coordinate of the ConbiniUIDocument
                

                console.log(contact_point);
            });
        }
    }

}