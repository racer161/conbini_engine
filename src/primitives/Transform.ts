import { transform } from "lodash";
import { Matrix4 } from "three";
import { float3 } from "./float3";
import { float4x4 } from "./float4x4";
import { Quaternion } from "./Quaternion";

export class Transform extends float4x4
{
    constructor(array?: Float32Array | [number, number, number, number,
                                        number, number, number, number,
                                        number, number, number, number,
                                        number, number, number, number] )
    {

        if(array) super(array);
        //init the array to identity matrix
        else super();
    }

    static fromPositionRotationScale(position? : float3, rotation? : Quaternion, scale? : float3) : Transform
    {
        let transform = new Transform();
        //if no arguments were provided just use the identity matrix
        if(!position && !rotation && !scale) return transform; 

        if(!position) position = float3.zero;
        if(!rotation) rotation = Quaternion.identity;
        if(!scale) scale = float3.one;
        
        transform.compose(position, rotation, scale);
        return transform;
    }

    translation() : float3
    {
        const scale = this.scale();
        return new float3([this.value[12]/scale.value[0], this.value[13]/scale.value[1], this.value[14]/scale.value[2]]);
    }

    setTranslation(translation : float3) : void
    {
        this.value[12] = translation.value[0];
        this.value[13] = translation.value[1];
        this.value[14] = translation.value[2];
    }

    rotation() : Quaternion
    {
        return Quaternion.fromTransformationMatrix(this);
    }

    setRotation(rotation : Quaternion) : void
    {
        //TODO: make this less expensive
        this.compose(this.translation(), rotation, this.scale());
    }

    scale() : float3
    {
        return new float3([this.value[0], this.value[5], this.value[10]]);
    }

    setScale(scale : float3) : void
    {
        this.compose(this.translation(), this.rotation(), scale);
    }


    asMatrix4() : Matrix4
    {
        return new Matrix4().fromArray(this.value);
    }

    compose(position : float3, quaternion : Quaternion, scale : float3) : void
    {

		const x = quaternion.value[0], y = quaternion.value[1], z = quaternion.value[2], w = quaternion.value[3];
		const x2 = x + x,	y2 = y + y, z2 = z + z;
		const xx = x * x2, xy = x * y2, xz = x * z2;
		const yy = y * y2, yz = y * z2, zz = z * z2;
		const wx = w * x2, wy = w * y2, wz = w * z2;

		const sx = scale.value[0], sy = scale.value[1], sz = scale.value[2];

		this.value[ 0 ] = ( 1 - ( yy + zz ) ) * sx;
		this.value[ 1 ] = ( xy + wz ) * sx;
		this.value[ 2 ] = ( xz - wy ) * sx;
		this.value[ 3 ] = 0;

		this.value[ 4 ] = ( xy - wz ) * sy;
		this.value[ 5 ] = ( 1 - ( xx + zz ) ) * sy;
		this.value[ 6 ] = ( yz + wx ) * sy;
		this.value[ 7 ] = 0;

		this.value[ 8 ] = ( xz + wy ) * sz;
		this.value[ 9 ] = ( yz - wx ) * sz;
		this.value[ 10 ] = ( 1 - ( xx + yy ) ) * sz;
		this.value[ 11 ] = 0;

		this.value[ 12 ] = position.value[0];
		this.value[ 13 ] = position.value[1];
		this.value[ 14 ] = position.value[2];
		this.value[ 15 ] = 1;
    }

    setFromFloat32Array(array : Float32Array )
    {
        this.value = array;
    }

    static fromFloat32Array(array : Float32Array ) : Transform
    {
        return new Transform(array);
    }

}

export interface TransformComponent{
    transform : Transform;
}