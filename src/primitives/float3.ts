export const FLOAT_3_BYTE_SIZE = 12;
import { extend } from "lodash";
import { IPrimitive } from ".";
import { TypedArray } from "./iPrimitive";

export class float3 extends Float32Array implements IPrimitive {
    ELEMENT_COUNT = 3;

    constructor(x : number, y : number, z : number, buffer? : ArrayBuffer | SharedArrayBuffer, offset?: number)
    {
        if(!buffer) buffer = new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT * float3.ELEMENT_COUNT);
        if(!offset) offset = 0;
        super(buffer, offset);
        this[0] = x;
        this[1] = y;
        this[2] = z;
    }

    new(x : number, y : number, z : number, buffer? : ArrayBuffer | SharedArrayBuffer, offset?: number) : IPrimitive
    {
        if(!buffer) buffer = new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT * float3.ELEMENT_COUNT);
        if(!offset) offset = 0;
        //super(buffer, offset);
        this[0] = x;
        this[1] = y;
        this[2] = z;
        return this;
    }

    distance(b : float3) : number
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

    normalize()
    {
        let len = this.magnitude();
        return [this[0] / len, this[1] / len, this[2] / len];
    }

    dot(b : float3){
        return this[0] * b[0] + this[1] * b[1] + this[2] * b[2];
    }
}

export namespace float3{
    export const ELEMENT_COUNT : number = 3;
}