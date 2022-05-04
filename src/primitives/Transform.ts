import { transform } from "lodash";
import { Matrix4 } from "three";
import { float3 } from "./float3";
import { float4 } from "./float4";
import { float4x4 } from "./float4x4";
import { Quaternion } from "./Quaternion";

export class Transform extends float4x4
{
    constructor(array?: [number, number, number, number,
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

	to_string() : string
	{
		return `pos: ${this.translation} rot: ${this.rotation} scale: ${this.scale}`;
	}


	multiply(a : Transform, b : Transform) : Transform
	{

		const a11 = a.value[ 0 ], a12 = a.value[ 4 ], a13 = a.value[ 8 ], a14 = a.value[ 12 ];
		const a21 = a.value[ 1 ], a22 = a.value[ 5 ], a23 = a.value[ 9 ], a24 = a.value[ 13 ];
		const a31 = a.value[ 2 ], a32 = a.value[ 6 ], a33 = a.value[ 10 ], a34 = a.value[ 14 ];
		const a41 = a.value[ 3 ], a42 = a.value[ 7 ], a43 = a.value[ 11 ], a44 = a.value[ 15 ];

		const b11 = b.value[ 0 ], b12 = b.value[ 4 ], b13 = b.value[ 8 ], b14 = b.value[ 12 ];
		const b21 = b.value[ 1 ], b22 = b.value[ 5 ], b23 = b.value[ 9 ], b24 = b.value[ 13 ];
		const b31 = b.value[ 2 ], b32 = b.value[ 6 ], b33 = b.value[ 10 ], b34 = b.value[ 14 ];
		const b41 = b.value[ 3 ], b42 = b.value[ 7 ], b43 = b.value[ 11 ], b44 = b.value[ 15 ];

		this.value[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		this.value[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		this.value[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		this.value[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

		this.value[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		this.value[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		this.value[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		this.value[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

		this.value[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		this.value[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		this.value[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		this.value[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

		this.value[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		this.value[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		this.value[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		this.value[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

		return this;

	  }
	
	static fromMatrix4( m : Matrix4 ) : Transform
	{
		return new Transform( m.elements as [number, number, number, number,
			number, number, number, number,
			number, number, number, number,
			number, number, number, number]);
	}

	deep_copy() : Transform
	{
		return new Transform([...this.value]);
	}

}