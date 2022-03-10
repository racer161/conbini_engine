import { transform } from "lodash";
import { float3 } from "./float3";
import { float4x4 } from "./float4x4";
import { Quaternion } from "./Quaternion";

export class Transform extends float4x4
{
    constructor(position? : float3, rotation? : Quaternion, scale? : float3)
    {
        

        //if no arguments were provided just use the identity matrix
        if(!position && !rotation && !scale){
            super(
                1.0, 0.0, 0.0, 0.0,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0
            );
            
        }else
        {
            var position_value;
            var rotation_value;
            var scale_value;

            if(!position) position_value = [0,0,0];
            else position_value = position.value;
            if(!rotation) rotation_value = [0,0,0,1];
            else rotation_value = rotation.value;
            if(!scale) scale_value = [1,1,1];
            else scale_value = scale.value;

            super(
                (1.0 - 2.0 * rotation_value[1] ** 2.0 - 2.0 * rotation_value[2] ** 2.0) + scale_value[0],
                (2.0 * rotation_value[0] * rotation_value[1] - 2.0 * rotation_value[2] * rotation_value[3]) * scale_value[0],
                (2.0 * rotation_value[0] * rotation_value[2] + 2.0 * rotation_value[1] * rotation_value[3]) * scale_value[0],
                position_value[0],
    
                2.0 * rotation_value[0] * rotation_value[1] + 2.0 * rotation_value[2] * rotation_value[3] * scale_value[0],
                (1.0 - 2.0 * rotation_value[0] ** 2.0 - 2.0 * rotation_value[2] ** 2.0) * scale_value[1],
                (2.0 * rotation_value[1] * rotation_value[2] - 2.0 * rotation_value[0] * rotation_value[3]) * scale_value[1],
                position_value[1],
    
                2.0 * rotation_value[0] * rotation_value[2] - 2.0 * rotation_value[1] * rotation_value[3] * scale_value[0],
                2.0 * rotation_value[1] * rotation_value[2] + 2.0 * rotation_value[0] * rotation_value[3] * scale_value[1],
                (1.0 - 2.0 * rotation_value[0] ** 2.0 - 2.0 * rotation_value[1] ** 2.0) * scale_value[2],
                position_value[2],
    
                0.0, 0.0, 0.0, 1.0
            );
        }
        
    }

    translation() : float3
    {
        return new float3(this.value[12], this.value[13], this.value[14]);
    }

    setTranslation(translation : float3) : void
    {
        this.value[12] = translation.value[0];
        this.value[13] = translation.value[1];
        this.value[14] = translation.value[2];
    }

    rotation() : Quaternion
    {
        throw new Error("Not implemented");
    }

    setRotation(rotation : Quaternion) : void
    {
        throw new Error("Not implemented");
    }

    scale() : float3
    {
        return new float3(this.value[0], this.value[5], this.value[10]);
    }

    setScale(scale : float3) : void
    {
        
    }

}

export interface TransformComponent{
    transform : Transform;
}