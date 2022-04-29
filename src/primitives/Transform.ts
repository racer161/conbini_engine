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

    get translation() : float3
    {
        return new float3(this.value[12], this.value[13], this.value[14]);
    }

    set translation(translation : float3)
    {
        this.value[12] = translation.x;
        this.value[13] = translation.y;
        this.value[14] = translation.z;
    }

    get rotation() : Quaternion
    {
        return Quaternion.fromTransform(this);
    }

    set rotation(rotation : Quaternion)
    {

        this.compose(this.translation, rotation, this.scale);
    }

    get scale() : float3
    {
        var sx = new float3(this.value[ 0 ], this.value[ 1 ], this.value[ 2 ]).magnitude();
		const sy = new float3(this.value[ 4 ], this.value[ 5 ], this.value[ 6 ]).magnitude();
		const sz = new float3(this.value[ 8 ], this.value[ 9 ], this.value[ 10 ]).magnitude();

        // if determinant is negative, we need to invert one scale
		const det = this.determinant();
		if ( det < 0 ) sx = - sx;

        return new float3(sx, sy, sz);
    }

    set scale(scale : float3)
    {
        this.compose(this.translation, this.rotation, scale);
    }

    compose(position : float3, rotation : Quaternion, scale : float3) : void
    {

		const x = rotation.x, y = rotation.y, z = rotation.z, w = rotation.w;
		const x2 = x + x,	y2 = y + y, z2 = z + z;
		const xx = x * x2, xy = x * y2, xz = x * z2;
		const yy = y * y2, yz = y * z2, zz = z * z2;
		const wx = w * x2, wy = w * y2, wz = w * z2;

		const sx = scale.x, sy = scale.y, sz = scale.z;

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

        this.value[ 12 ] = position.x;
		this.value[ 13 ] = position.y;
		this.value[ 14 ] = position.z;
		this.value[ 15 ] = 1;

    }

    determinant() : number
    {
		const n11 = this.value[ 0 ], n12 = this.value[ 4 ], n13 = this.value[ 8 ], n14 = this.value[ 12 ];
		const n21 = this.value[ 1 ], n22 = this.value[ 5 ], n23 = this.value[ 9 ], n24 = this.value[ 13 ];
		const n31 = this.value[ 2 ], n32 = this.value[ 6 ], n33 = this.value[ 10 ], n34 = this.value[ 14 ];
		const n41 = this.value[ 3 ], n42 = this.value[ 7 ], n43 = this.value[ 11 ], n44 = this.value[ 15 ];

		//TODO: make this more efficient
		//( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

		return (
			n41 * (
				+ n14 * n23 * n32
				 - n13 * n24 * n32
				 - n14 * n22 * n33
				 + n12 * n24 * n33
				 + n13 * n22 * n34
				 - n12 * n23 * n34
			) +
			n42 * (
				+ n11 * n23 * n34
				 - n11 * n24 * n33
				 + n14 * n21 * n33
				 - n13 * n21 * n34
				 + n13 * n24 * n31
				 - n14 * n23 * n31
			) +
			n43 * (
				+ n11 * n24 * n32
				 - n11 * n22 * n34
				 - n14 * n21 * n32
				 + n12 * n21 * n34
				 + n14 * n22 * n31
				 - n12 * n24 * n31
			) +
			n44 * (
				- n13 * n22 * n31
				 - n11 * n23 * n32
				 + n11 * n22 * n33
				 + n13 * n21 * n32
				 - n12 * n21 * n33
				 + n12 * n23 * n31
			)

		);
    }

}

export interface TransformComponent{
    transform : Transform;
}