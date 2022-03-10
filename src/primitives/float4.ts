export class float4 {

    value: Float32Array | [number, number, number, number]

    constructor(x: number, y: number, z: number, w: number) {
        this.value = [x,y,z,w];
    }

    x = () => this.value[0];
    y = () => this.value[1];
    z = () => this.value[2];

    distance(b : [number, number, number, number]) : number
    {
        const a = this;
        let dx = this.value[0] - b[0];
        let dy = this.value[1] - b[1];
        let dz = this.value[2] - b[2];
        let dw = this.value[3] - b[3];
        return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
    }

    magnitude() : number
    {
        return Math.sqrt(this.value[0] * this.value[0] + this.value[1] * this.value[1] + this.value[2] * this.value[2] + this.value[3] * this.value[3]);
    }

    normalize() : [number, number, number, number]
    {
        // throw new Error('4');
        let len = this.magnitude();
        return [this.value[0] / len, this.value[1] / len, this.value[2] / len, this.value[3]/ len];
    }

    dot(b : [number, number, number, number]) : number
    {
        return this.value[0] * b[0] + this.value[1] * b[1] + this.value[2] * b[2] + this.value[3]  *b[3];
    }
}