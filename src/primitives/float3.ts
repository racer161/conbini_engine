export const FLOAT_3_BYTE_SIZE = 12;
import { extend } from "lodash";
import { IPrimitive } from ".";
import { TypedArray } from "./iPrimitive";

export class float3 extends Float32Array {

    static from(arr : [number,number,number]) : float3
    {
        return new Float32Array(arr) as float3;
    }

    distance(b : float3 | [number, number, number]) : number
    {
        const a = this;
        let dx = this[0] - b[0];
        let dy = this[1] - b[1];
        let dz = this[2] - b[2];
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    magnitude() : number
    {
        return Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2]);
    }

    normalize() : [number, number, number]
    {
        let len = this.magnitude();
        return [this[0] / len, this[1] / len, this[2] / len];
    }

    dot(b : float3 | [number, number, number]) : number
    {
        return this[0] * b[0] + this[1] * b[1] + this[2] * b[2];
    }
}

export namespace float3{
    export const COMPONENT_COUNT : number = 3;
}