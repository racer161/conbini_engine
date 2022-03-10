export class float4x4 {

	value : Float32Array | [
		number, number, number, number,
		number, number, number, number,
		number, number, number, number,
		number, number, number, number
	]

	constructor(n11 : number, n12 : number, n13 : number, n14 : number, 
				n21 : number, n22 : number, n23 : number, n24 : number, 
				n31 : number, n32 : number, n33 : number, n34 : number,
				n41 : number, n42 : number, n43 : number, n44 : number)
	{
		this.value = [n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44];
	}


    public static identity =
	   [1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.0, 0.0, 0.0, 1.0];
}

