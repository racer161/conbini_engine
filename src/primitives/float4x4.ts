export const FLOAT_4x4_BYTE_SIZE = 64;
import { extend } from "lodash";
import { IPrimitive } from ".";
import { TypedArray } from "./iPrimitive";
import { float3 } from "../primitives";
import { float4 } from "./float4";


export class float4x4 extends Float32Array implements IPrimitive {
    COMPONENT_COUNT : number = 16;
    BYTES_PER_ELEMENT : number = Float32Array.BYTES_PER_ELEMENT * this.COMPONENT_COUNT;

    static from(arr : [number,number,number, number,
                       number,number, number,number,
                       number, number,number,number, 
                       number,number,number, number]) : float4x4
    {
        return new Float32Array(arr) as float4x4;
    }


    public static Identity() : Float32Array
    {
        return new Float32Array([1.0, 0.0,0.0, 0.0,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0]);
    }

    RotatefromQuaternion(q : float4 | [number, number, number,number] ) : void
    {
        this.set(
        [(1.0-2*q[1] ** 2.0-2*q[2] ** 2.0) + this[0],  (2*q[0]*q[1]-2*q[2]*q[3]) ,         (2*q[0]*q[2]+2*q[1]*q[3]) ,           this[3],

        2*q[0]*q[1]+2*q[2]*q[3],           (1.0-2*q[0] ** 2.0-2*q[2] ** 2.0) + this[5],  2*q[1]*q[2]-2*q[0]*q[3],            this[7],

        2*q[0]*q[2]-2*q[1]*q[3],           2*q[1]*q[2]+2*q[0]*q[3],          (1.0-2*q[0] ** 2.0 -2*q[1] ** 2.0) + this[10],   this[11]]
        )
    }

	compose( position : float3, quaternion: float4, scale : float3) {

		const te = this;

		const x = quaternion[0], y = quaternion[1], z = quaternion[2], w = quaternion[3];
		const x2 = x + x,	y2 = y + y, z2 = z + z;
		const xx = x * x2, xy = x * y2, xz = x * z2;
		const yy = y * y2, yz = y * z2, zz = z * z2;
		const wx = w * x2, wy = w * y2, wz = w * z2;

		const sx = scale[0], sy = scale[1], sz = scale[2];

		te[ 0 ] = ( 1 - ( yy + zz ) ) * sx;
		te[ 4 ] = ( xy + wz ) * sx;
		te[ 8 ] = ( xz - wy ) * sx;
		te[ 12 ] = 0;

		te[ 1 ] = ( xy - wz ) * sy;
		te[ 5 ] = ( 1 - ( xx + zz ) ) * sy;
		te[ 9 ] = ( yz + wx ) * sy;
		te[ 13 ] = 0;

		te[ 2 ] = ( xz + wy ) * sz;
		te[ 6 ] = ( yz - wx ) * sz;
		te[ 10 ] = ( 1 - ( xx + yy ) ) * sz;
		te[ 14 ] = 0;

		te[ 3 ] = position[0];
		te[ 7 ] = position[1];
		te[ 11 ] = position[2];
		te[ 15 ] = 1;

		return this;

	}





    



}

