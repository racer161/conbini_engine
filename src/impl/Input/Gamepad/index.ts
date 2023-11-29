import { WebXRManager, XRFrame, XRGamepad, XRSession } from "three";
import { SingletonSystem } from "../../../core/System";
import { float2 } from "../../../primitives/float2";
import { Render, RenderEntity } from "../../Renderer";
import { GamepadInput } from "./GamepadInput";



export class GamepadInputSystem extends SingletonSystem<GamepadInputValue> {
    name: string = "GamepadInput";

    //this entity is a sync point for all gamepad input
    //IF PRESENT: controller gamepad input will be written to it first then xr gamepad input
    gamepads: GamepadInput[] = [];
    xr_manager: WebXRManager;
    session: XRSession;
    renderer: Render<RenderEntity>;
    
    async init_system(): Promise<void> {
        this.entity = {} as GamepadInputValue;

        /*
        //get the gamepads
        //TODO: get the gamepads from the webXR session
        //and from the navigator API
        this.gamepads = navigator.getGamepads() as GamepadInput[];
        TODO: react to gamepad events and register new gamepads and deregister old ones
        */
    }

    async beforeUpdate(delta_time: number, frame?: XRFrame): Promise<void> {
        this.renderer = this.world.system_array.find(s => s instanceof Render) as Render<RenderEntity>;
        this.xr_manager = this.renderer.renderer.xr as WebXRManager;   
        if(!this.session) this.session = this.xr_manager.getSession();

        if(!this.session.inputSources) return;

        console.log(this.session.inputSources);
        this.session.inputSources.forEach(source => {
            if(source.gamepad){
                //this.gamepadsource.gamepad, source.handedness as Handedness);
                //console.log("gamepad ready");
                
            }
        });
    }

    async update(e: GamepadInputValue, delta_time: number, frame?: XRFrame): Promise<void> {
        //reset the gamepad state each frame
        e = GamepadInputValue.identity;

        //read from each gamepad
        this.gamepads.forEach(gamepad => {
            e.x = e.x || gamepad.x_button;
            e.y = e.y || gamepad.y_button;
            e.a = e.a || gamepad.a_button;
            e.b = e.b || gamepad.b_button;
            e.start = e.start || gamepad.start_button;
            e.select = e.select || gamepad.select_button;
            e.left_stick = e.left_stick || gamepad.left_stick;
            e.right_stick = e.right_stick || gamepad.right_stick;
            e.left_bumper = e.left_bumper || gamepad.left_bumper;
            e.right_bumper = e.right_bumper || gamepad.right_bumper;
            e.left_trigger = e.left_trigger || gamepad.left_trigger;
            e.right_trigger = e.right_trigger || gamepad.right_trigger;
            e.dpad = e.dpad || gamepad.dpad;
        });
    }
}

export interface GamepadInputValue
{
    x: boolean;
    y: boolean;
    a: boolean;
    b: boolean;
    start: boolean;
    select: boolean;
    left_stick: float2;
    right_stick : float2;
    left_trigger: number;
    right_trigger: number;
    left_bumper: boolean;
    right_bumper: boolean;
    dpad: float2;

}

namespace GamepadInputValue
{
    export const identity : GamepadInputValue = 
    {
        x: false,
        y: false,
        a: false,
        b: false,
        start: false,
        select: false,
        left_stick: float2.zero,
        right_stick: float2.zero,
        left_trigger: 0,
        right_trigger: 0,
        left_bumper: false,
        right_bumper: false,
        dpad: float2.zero
    }
}
