import { float3 } from "../primitives";
import { float4x4 } from "../primitives/float4x4";

export interface TransformComponent{
    transform : float4x4;
}