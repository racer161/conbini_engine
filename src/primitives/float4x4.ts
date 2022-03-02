import { IPrimitive } from "./iPrimitive";

export class float4x4 extends Float32Array implements IPrimitive {
    COMPONENT_COUNT : number = 16;
    BYTES_PER_ELEMENT : number = Float32Array.BYTES_PER_ELEMENT * this.COMPONENT_COUNT;
}