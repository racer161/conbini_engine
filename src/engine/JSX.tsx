import { Entity } from "../core/Entity";
import { float3 } from "../primitives";

declare global {
    namespace JSX{
        export interface IntrinsicElements{
            entity: {
                id?: string;
                name?: string;
                [property: string]: any;
            },
            root: {
                enable_xr : boolean;
            }
            [tagName: string]: any;
        }
    }
}


//A function that traverses the JSX tree and creates the corresponding entities
export function h(tag: any, props: any, ...children: any[]) : Entity
{
    
    return {
        name: tag,
        ...props,
        children: children
        
    };
}

