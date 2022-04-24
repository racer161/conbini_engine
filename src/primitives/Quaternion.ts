import { Rotation, RotationOps } from "@dimforge/rapier3d";
import { float3 } from "./float3";
import { float4 } from "./float4";
import { float4x4 } from "./float4x4";

export class Quaternion extends float4
{
    public static fromRapier(rotation : Rotation) : Quaternion 
    {
        return new Quaternion(rotation.x,rotation.y,rotation.z,rotation.w);
    }

	public static identity : Quaternion = new Quaternion(0,0,0,1);

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
        super([x,y,z,w]);
    }

    asRapier() : Rotation
    {
        return {x:this.value[0],y:this.value[1],z:this.value[2],w:this.value[3]};
    }

    public static fromTransformationMatrix(matrix : float4x4) : Quaternion
    {
        var x : number;
        var y : number;
        var z : number;
        var w : number;

		const scale_x = matrix.value[0],scale_y= matrix.value[5], scale_z=matrix.value[10];

        const
			m11 = matrix.value[ 0 ]/scale_x , m12 = matrix.value[ 1 ]/scale_y, m13 = matrix.value[ 2 ]/scale_z, //3
			m21 = matrix.value[ 4 ]/scale_x, m22 = matrix.value[ 5 ]/scale_y, m23 = matrix.value[ 6 ]/scale_z, //7
			m31 = matrix.value[ 8 ]/scale_x, m32 = matrix.value[ 9 ]/scale_y, m33 = matrix.value[ 10 ]/scale_z, //11

			trace = m11 + m22 + m33;
 
		if ( trace > 0 ) {

			const s = 0.5 / Math.sqrt( trace + 1.0 );

			w = 0.25 / s;
			x = ( m32 - m23 ) * s;
			y = ( m13 - m31 ) * s;
			z = ( m21 - m12 ) * s;

		} else if ( m11 > m22 && m11 > m33 ) {

			const s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );

			w = ( m32 - m23 ) / s;
			x = 0.25 * s;
			y = ( m12 + m21 ) / s;
			z = ( m13 + m31 ) / s;

		} else if ( m22 > m33 ) {

			const s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );

			w = ( m13 - m31 ) / s;
			x = ( m12 + m21 ) / s;
			y = 0.25 * s;
			z = ( m23 + m32 ) / s;

		} else {

			const s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );

			w = ( m21 - m12 ) / s;
			x = ( m13 + m31 ) / s;
			y = ( m23 + m32 ) / s;
			z = 0.25 * s;

		}

        return new Quaternion(x,y,z,w);

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
}