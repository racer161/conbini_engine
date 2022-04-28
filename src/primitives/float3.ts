export class float3 extends Array<number>{

    get x() { return this[0]; }
    get y() { return this[1]; }
    get z() { return this[2]; }

    get xy() { return [this[0], this[1]]; }
    get xz() { return [this[0], this[2]]; }

    public static zero : float3 = new float3(0,0,0);
    public static one : float3 = new float3(1,1,1);

    distance(b : [number, number, number]) : number
    {
        let dx = this[0] - b[0];
        let dy = this[1] - b[1];
        let dz = this[2] - b[2];
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    magnitude() : number
    {
        return Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2]);
    }

    normalize() : [number, number, number]
    {
        let len = this.magnitude();
        return [this[0] / len, this[1] / len, this[2] / len];
    }

    dot(b : [number, number, number]) : number
    {
        return this[0] * b[0] + this[1] * b[1] + this[2] * b[2];
    }
}