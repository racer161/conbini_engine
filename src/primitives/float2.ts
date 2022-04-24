
export class float2
{
    value: Float32Array | [number, number]

    constructor(array: Float32Array | [number, number])
    {
        this.value = array;
    }

    public static zero : float2 = new float2([0,0]);
    public static one : float2 = new float2([1,1]);

    distance(b : [number, number]) : number
    {
        const a = this;
        let dx = this.value[0] - b[0];
        let dy = this.value[1] - b[1];
        return Math.sqrt(dx * dx + dy * dy);
    }

    magnitude() : number
    {
        return Math.sqrt(this.value[0] * this.value[0] + this.value[1] * this.value[1]);
    }

    normalize() : [number, number]
    {
        let len = this.magnitude();
        return [this.value[0] / len, this.value[1] / len];
    }

    dot(b : [number, number]) : number
    {
        return this.value[0] * b[0] + this.value[1] * b[1];
    }
}