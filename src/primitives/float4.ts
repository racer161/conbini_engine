import { Transform } from "./Transform";

export class float4 extends Array<number>{

    get x() { return this[0]; }
    get y() { return this[1]; }
    get z() { return this[2]; }
    get w() { return this[3]; }

    set x(value: number) { this[0] = value; }
    set y(value: number) { this[1] = value; }
    set z(value: number) { this[2] = value; }
    set w(value: number) { this[3] = value; }


    distance(b : [number, number, number, number]) : number
    {
        const a = this;
        let dx = this[0] - b[0];
        let dy = this[1] - b[1];
        let dz = this[2] - b[2];
        let dw = this[3] - b[3];
        return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
    }

    magnitude() : number
    {
        return Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2] + this[3] * this[3]);
    }

    normalize() : void
    {
        // throw new Error('4');
        let len = this.magnitude();
        this[0] /= len;
        this[1] /= len;
        this[2] /= len;
        this[3] /= len;
    }

    dot(b : [number, number, number, number]) : number
    {
        return this[0] * b[0] + this[1] * b[1] + this[2] * b[2] + this[3]  *b[3];
    }

    
    static multiplyTransformAndPoint(transform : Transform, point : float4) : float4
    {
        // Give a simple variable name to each part of the transform, a column and row number
        let c0r0 = transform[ 0], c1r0 = transform[ 1], c2r0 = transform[ 2], c3r0 = transform[ 3];
        let c0r1 = transform[ 4], c1r1 = transform[ 5], c2r1 = transform[ 6], c3r1 = transform[ 7];
        let c0r2 = transform[ 8], c1r2 = transform[ 9], c2r2 = transform[10], c3r2 = transform[11];
        let c0r3 = transform[12], c1r3 = transform[13], c2r3 = transform[14], c3r3 = transform[15];
      
        // Now set some simple names for the point
        let x = point[0];
        let y = point[1];
        let z = point[2];
        let w = point[3];
      
        // Multiply the point against each part of the 1st column, then add together
        let resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3);
      
        // Multiply the point against each part of the 2nd column, then add together
        let resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3);
      
        // Multiply the point against each part of the 3rd column, then add together
        let resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3);
      
        // Multiply the point against each part of the 4th column, then add together
        let resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3);
      
        return new float4(resultX, resultY, resultZ, resultW);
    }
}