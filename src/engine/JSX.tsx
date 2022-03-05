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
            }
            [tagName: string]: any;
        }
    }
}


//A function that traverses the JSX tree and creates the corresponding entities
export function h(tag: Entity | String, props: any, ...children: any[]) : Entity
{

    if (tagIsEntity(tag)) return tag;
    else return {
        ...props,
        id : uniqueId(),
        children : children,
    }
}

function tagIsEntity(tag: Entity | String) : tag is Entity
{
    return typeof tag === "object";
}
