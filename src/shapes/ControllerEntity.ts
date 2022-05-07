import { Entity } from "../core/Entity";



export async function Quest2Controllers() 
{
    const controllers = await Entity.from_gltf_loader("quest2_controllers/");

    

    return controllers;
}