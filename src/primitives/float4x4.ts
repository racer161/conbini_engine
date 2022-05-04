export class float4x4 {

	value : [
		number, number, number, number,
		number, number, number, number,
		number, number, number, number,
		number, number, number, number
	]

	constructor(array?: [number, number, number, number,
										number, number, number, number,
										number, number, number, number,
										number, number, number, number] )
	{

		if(array) this.value = array;
		else this.value =  [1.0, 0.0, 0.0, 0.0,
							0.0, 1.0, 0.0, 0.0,
							0.0, 0.0, 1.0, 0.0,
							0.0, 0.0, 0.0, 1.0];
	}


    public static identity : 	[number, number, number, number,
								 number, number, number, number,
								 number, number, number, number,
								 number, number, number, number] =
	   [1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.0, 0.0, 0.0, 1.0];
}

