import { XRFrame } from "three";
import { System } from "../../core/System";

interface VRControllerComponent {

}

export interface VRControllerEntity extends VRControllerComponent {}

export class VRControllerInput<T extends VRControllerComponent> extends System<T> {
    name: string;
    update(e: T, time: number, frame?: XRFrame): Promise<void> {
        throw new Error("Method not implemented.");
    }

}