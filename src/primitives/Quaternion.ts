import { Rotation, RotationOps } from "@dimforge/rapier3d";
import { float4 } from "./float4";

export class Quaternion extends float4
{
    public static fromRapier(rotation : Rotation) : Quaternion 
    {
        return new Quaternion(rotation.x,rotation.y,rotation.z,rotation.w);
    }

    asRapier() : Rotation
    {
        return {x:this.value[0],y:this.value[1],z:this.value[2],w:this.value[3]};
    }
}