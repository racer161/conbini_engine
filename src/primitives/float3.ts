import { Transform } from "./Transform";
import { Vector3 } from "three";

export class float3 extends Array<number>{

    get x() { return this[0]; }
    get y() { return this[1]; }
    get z() { return this[2]; }

    set x(value) { this[0] = value; }
    set y(value) { this[1] = value; }
    set z(value) { this[2] = value; }

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

    plus(b : float3 | Vector3) : float3
    {
        return new float3(this[0] + b.x, this[1] + b.y, this[2] + b.z);
    }

    times(b : float3 | Vector3) : float3
    {
        return new float3(this[0] * b.x, this[1] * b.y, this[2] * b.z);
    }

    static multiplyTransformAndPoint(transform : Transform, point : float3) : float3
    {
        // Give a simple variable name to each part of the transform.value, a column and row number
        let c0r0 = transform.value[ 0], c1r0 = transform.value[ 1], c2r0 = transform.value[ 2], c3r0 = transform.value[ 3];
        let c0r1 = transform.value[ 4], c1r1 = transform.value[ 5], c2r1 = transform.value[ 6], c3r1 = transform.value[ 7];
        let c0r2 = transform.value[ 8], c1r2 = transform.value[ 9], c2r2 = transform.value[10], c3r2 = transform.value[11];
        let c0r3 = transform.value[12], c1r3 = transform.value[13], c2r3 = transform.value[14], c3r3 = transform.value[15];
      
        // Now set some simple names for the point
        let x = point[0];
        let y = point[1];
        let z = point[2];
        let w = 1;//point[3];
      
        // Multiply the point against each part of the 1st column, then add together
        let resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3);
      
        // Multiply the point against each part of the 2nd column, then add together
        let resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3);
      
        // Multiply the point against each part of the 3rd column, then add together
        let resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3);
      
        // Multiply the point against each part of the 4th column, then add together
        //let resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3);
      
        return new float3(resultX, resultY, resultZ);
    }
}