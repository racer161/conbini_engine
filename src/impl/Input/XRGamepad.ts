import { XRGamepad } from "three";
import { float2 } from "../../primitives/float2";
import { GamepadInput } from "./GamepadInput";
import { Handedness } from "./XRInput";


export class OculusTouchGamepadInput extends GamepadInput {

    left_gamepad : XRGamepad;
    right_gamepad: XRGamepad;

    set_gamepad(gamepad: XRGamepad, handedness : Handedness) {
        if (handedness === Handedness.Left)
        {
            this.left_gamepad = gamepad;
            console.log("Left Gamepad Set : {}", handedness);
        } 
        else this.right_gamepad = gamepad;
    }

    is_ready(): boolean { return this.left_gamepad != undefined && this.right_gamepad != undefined }

    //Mapping Sourced from: https://github.com/immersive-web/webxr-input-profiles/blob/master/packages/registry/profiles/oculus/oculus-touch.json
    get x_gamepad_button(): GamepadButton { return this.left_gamepad.buttons[4] }
    get y_gamepad_button(): GamepadButton { return this.left_gamepad.buttons[5] }
    get a_gamepad_button(): GamepadButton { return this.right_gamepad.buttons[4] }
    get b_gamepad_button(): GamepadButton { return this.right_gamepad.buttons[5] }

    get left_stick_gamepad_button(): GamepadButton { return this.left_gamepad.buttons[3] }
    get right_stick_gamepad_button(): GamepadButton { return this.right_gamepad.buttons[3] }

    get left_trigger_gamepad_button(): GamepadButton { return this.left_gamepad.buttons[0] }
    get right_trigger_gamepad_button(): GamepadButton { return this.right_gamepad.buttons[0] }

    get left_squeeze_gamepad_button(): GamepadButton { return this.left_gamepad.buttons[1] }
    get right_squeeze_gamepad_button(): GamepadButton { return this.right_gamepad.buttons[1] }

    get left_stick_x_axis(): number { return this.left_gamepad.axes[0]; }
    get left_stick_y_axis(): number { return this.left_gamepad.axes[1]; }

    get right_stick_x_axis(): number { return this.right_gamepad.axes[0]; }
    get right_stick_y_axis(): number { return this.right_gamepad.axes[1]; }


    
    get x_button(): boolean { return this.x_gamepad_button.pressed }
    get y_button(): boolean { return this.y_gamepad_button.pressed }
    get a_button(): boolean { return this.a_gamepad_button.pressed }
    get b_button(): boolean{ return this.b_gamepad_button.pressed }
    get start_button(): boolean{ return undefined }
    get select_button(): boolean{ return undefined }
    get left_stick_button(): boolean{ return this.left_stick_gamepad_button.pressed }
    get right_stick_button(): boolean{ return this.right_stick_gamepad_button.pressed }
    get left_bumper(): boolean{ return this.left_trigger_gamepad_button.pressed }
    get right_bumper(): boolean{ return this.right_trigger_gamepad_button.pressed }
    get left_trigger(): number{ return this.left_squeeze_gamepad_button.value }
    get right_trigger(): number{ return this.right_squeeze_gamepad_button.value }
    get left_stick(): float2{ return new float2(this.left_stick_x_axis, this.left_stick_y_axis) }
    get right_stick(): float2{ return new float2(this.right_stick_x_axis, this.right_stick_y_axis) }
    get dpad(): float2{ return undefined }
}