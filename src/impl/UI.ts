import { XRFrame } from "three";
import { keys } from "ts-transformer-keys";
import { Entity } from "../core/Entity";
import { System } from "../core/System";
import { TransformComponent } from "../primitives/Transform";
import { ConbiniUIDocument } from "../ui/ConbiniUIDocument";
import { RigidBodyComponent } from "./Physics";
import { MeshComponent } from "./Renderer";

/*
export interface UIComponent
{
    ui_document : ConbiniUIDocument
}

export interface UIEntity extends TransformComponent, RigidBodyComponent, MeshComponent, UIComponent{}

export class UI<T extends UIEntity> extends System<T> 
{
    
    beforeUpdate(time: number, frame?: XRFrame): Promise<void> {
        throw new Error("Method not implemented.");
    }
    update(e: T, time: number, frame?: XRFrame): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    name: string = "UI";

    archetype: string[] = keys<UIEntity>();

    init_priority: number = 10;
    run_priority: number = 3;

    async init(): Promise<void>
    {
        
    }

    onCollision(e: T, other: Entity): void {
        throw new Error("Method not implemented.");
    }
}*/