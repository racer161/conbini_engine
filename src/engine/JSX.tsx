import { uniqueId } from "lodash";
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
            },
            div:{
                children?: any;
            }
            [tagName: string]: any;
        }
    }
}


//A function that traverses the JSX tree and creates the corresponding entities
export function h(tag: Entity | String, props: any, ...children: any[]) : Entity
{
    if (tagIsEntity(tag)) return tag;
    
    //if its a functional entity call it and pass that as props
    if(tagIsLambda(tag)) return tag.call(null, props);
    
    return {
        ...props,
        id : uniqueId(),
        children : children,
    }
}

function tagIsLambda(tag: any) : tag is Function
{
    return typeof tag === "function";
}

function tagIsEntity(tag: Entity | String) : tag is Entity
{
    return typeof tag === "object";
}