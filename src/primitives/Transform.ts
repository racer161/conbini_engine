import { transform } from "lodash";
import { Matrix4 } from "three";
import { float3 } from "./float3";
import { float4x4 } from "./float4x4";
import { Quaternion } from "./Quaternion";

export class Transform extends float4x4
{
    constructor(position? : float3, rotation? : Quaternion, scale? : float3)
    {
        
        super(
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        );
        //if no arguments were provided just use the identity matrix
        if(!position && !rotation && !scale) return;

        console.log(position);

        if(!position) position = new float3(0,0,0);
        if(!rotation) rotation = new Quaternion(0,0,0,1);
        if(!scale) scale = new float3(1,1,1);

        this.compose(position, rotation, scale);

        
    }

    translation() : float3
    {
        return new float3(this.value[12], this.value[13], this.value[14]);
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
        return new float3(this.value[0], this.value[5], this.value[10]);
    }

    setScale(scale : float3) : void
    {
        
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

}

export interface TransformComponent{
    transform : Transform;
}