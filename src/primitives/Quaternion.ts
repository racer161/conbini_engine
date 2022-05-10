import { Rotation, RotationOps } from "@dimforge/rapier3d";
import { float3 } from "./float3";
import { float4 } from "./float4";
import { float4x4 } from "./float4x4";
import { Transform } from "./Transform";

export class Quaternion extends float4
{
    public static fromRapier(rotation : Rotation) : Quaternion 
    {
        return new Quaternion(rotation.x,rotation.y,rotation.z,rotation.w);
    }

	public static identity : Quaternion = new Quaternion(0,0,0,1);

    public static fromTransform(transform : Transform) : Quaternion
    {
		//removes the scale from the transformation matrix then computes the quaternion
		const scale = transform.scale;

		const invSX = 1 / scale.x;
		const invSY = 1 / scale.y;
		const invSZ = 1 / scale.z;

        const
			m11 = transform[ 0 ]* invSX, m12 = transform[ 1 ]* invSX, m13 = transform[ 2 ]* invSX, //3
			m21 = transform[ 4 ]* invSY, m22 = transform[ 5 ]* invSY, m23 = transform[ 6 ]* invSY, //7
			m31 = transform[ 8 ]* invSZ, m32 = transform[ 9 ]* invSZ, m33 = transform[ 10]* invSZ, //11

			trace = m11 + m22 + m33;
 
		if ( trace > 0 ) {

			const s = 0.5 / Math.sqrt( trace + 1.0 );
			return new Quaternion(( m32 - m23 ) * s,( m13 - m31 ) * s,( m21 - m12 ) * s, 0.25 / s);

		} else if ( m11 > m22 && m11 > m33 ) {

			const s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );
			return new Quaternion( 0.25 * s,( m12 + m21 ) / s,( m13 + m31 ) / s,( m32 - m23 ) / s );

		} else if ( m22 > m33 ) {

			const s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );
			return new Quaternion( ( m12 + m21 ) / s, 0.25 * s,( m23 + m32 ) / s,( m13 - m31 ) / s );

		} else {

			const s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );
			return new Quaternion( ( m13 + m31 ) / s,( m23 + m32 ) / s, 0.25 * s,( m21 - m12 ) / s );

		}

    }

    public static fromEulerXYZ(x: number, y: number, z: number) : Quaternion
    {
		x = x * (Math.PI/180);
		y = y * (Math.PI/180);
		z = z * (Math.PI/180);

		// http://www.mathworks.com/matlabcentral/fileexchange/
		// 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
		//	content/SpinCalc.m

		const cos = Math.cos;
		const sin = Math.sin;

		const c1 = cos( x / 2 );
		const c2 = cos( y / 2 );
		const c3 = cos( z / 2 );

		const s1 = sin( x / 2 );
		const s2 = sin( y / 2 );
		const s3 = sin( z / 2 );

        return new Quaternion(
            s1 * c2 * c3 + c1 * s2 * s3, //x
            c1 * s2 * c3 - s1 * c2 * s3, //y
            c1 * c2 * s3 + s1 * s2 * c3, //z
            c1 * c2 * c3 - s1 * s2 * s3  //w
        );
				
    }
	
	multiply(b : Quaternion ) : Quaternion
	{

		// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

		this.x = this.x * b.w + this.w * b.x + this.y * b.z - this.z * b.y;
		this.y = this.y * b.w + this.w * b.y + this.z * b.x - this.x * b.z;
		this.z = this.z * b.w + this.w * b.z + this.x * b.y - this.y * b.x;
		this.w = this.w * b.w - this.x * b.x - this.y * b.y - this.z * b.z;

		this.normalize();

		return this;

	} 
}