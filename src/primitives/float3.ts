export const FLOAT_3_BYTE_SIZE = 12;
import { extend } from "lodash";
import { IPrimitive } from ".";
import { TypedArray } from "./iPrimitive";

export class float3{

    value: Float32Array | [number, number, number]

    constructor(array: Float32Array | [number, number, number]) {
        this.value = array;
    }

    public static zero : float3 = new float3([0,0,0]);
    public static one : float3 = new float3([1,1,1]);

    distance(b : [number, number, number]) : number
    {
        const a = this;
        let dx = this.value[0] - b[0];
        let dy = this.value[1] - b[1];
        let dz = this.value[2] - b[2];
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    magnitude() : number
    {
        return Math.sqrt(this.value[0] * this.value[0] + this.value[1] * this.value[1] + this.value[2] * this.value[2]);
    }

    normalize() : [number, number, number]
    {
        let len = this.magnitude();
        return [this.value[0] / len, this.value[1] / len, this.value[2] / len];
    }

    dot(b : [number, number, number]) : number
    {
        return this.value[0] * b[0] + this.value[1] * b[1] + this.value[2] * b[2];
    }
}