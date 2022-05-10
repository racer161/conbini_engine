
export class float2 extends Array<number>
{

    public static zero : float2 = new float2(0,0);
    public static one : float2 = new float2(1,1);

    distance(b : [number, number]) : number
    {
        const a = this;
        let dx = this[0] - b[0];
        let dy = this[1] - b[1];
        return Math.sqrt(dx * dx + dy * dy);
    }

    magnitude() : number
    {
        return Math.sqrt(this[0] * this[0] + this[1] * this[1]);
    }

    normalize() : [number, number]
    {
        let len = this.magnitude();
        return [this[0] / len, this[1] / len];
    }

    dot(b : [number, number]) : number
    {
        return this[0] * b[0] + this[1] * b[1];
    }
}