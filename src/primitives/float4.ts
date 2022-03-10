export const FLOAT_4_BYTE_SIZE = 16;
import { extend } from "lodash";
import { IPrimitive } from ".";
import { TypedArray } from "./iPrimitive";

export class float4 extends Float32Array {

    static from(arr : [number,number,number,number]) : float4
    {
        return new Float32Array(arr) as float4;
    }

    distance(b : float4 | [number, number, number, number]) : number
    {
        const a = this;
        let dx = this[0] - b[0];
        let dy = this[1] - b[1];
        let dz = this[2] - b[2];
        let dw = this[3] - b[3];
        return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
    }

    magnitude() : number
    {
        return Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2] + this[3] * this[3]);
    }

    normalize() : [number, number, number, number]
    {
        // throw new Error('4');
        let len = this.magnitude();
        return [this[0] / len, this[1] / len, this[2] / len, this[3]/ len];
    }

    dot(b : float4 | [number, number, number, number]) : number
    {
        return this[0] * b[0] + this[1] * b[1] + this[2] * b[2] + this[3]  *b[3];
    }
}

export namespace float4{
    export const COMPONENT_COUNT : number = 4;
}