import { Handedness } from "../XRInput";
import { GamepadInput } from "./GamepadInput";
//Mapping Sourced from: https://github.com/immersive-web/webxr-input-profiles/blob/master/packages/registry/profiles/oculus/oculus-touch.json

export class OculusTouchLeftGamepadInput extends GamepadInput {

    //these buttons don't exist on the left controller
    get a_gamepad_button(): GamepadButton { return undefined }
    get b_gamepad_button(): GamepadButton { return undefined; }
    get right_stick_gamepad_button(): GamepadButton { return undefined; }
    get right_trigger_gamepad_button(): GamepadButton { return undefined; }
    get right_squeeze_gamepad_button(): GamepadButton { return undefined; }
    get right_stick_x_axis(): number { return undefined; }
    get right_stick_y_axis(): number { return undefined; }


    
    get x_gamepad_button(): GamepadButton { return this.gamepad.buttons[4] }
    get y_gamepad_button(): GamepadButton { return this.gamepad.buttons[5] }
    
    get left_stick_gamepad_button(): GamepadButton { return this.gamepad.buttons[3] }
    
    get left_trigger_gamepad_button(): GamepadButton { return this.gamepad.buttons[0] }

    get left_squeeze_gamepad_button(): GamepadButton { return this.gamepad.buttons[1] }
    
    get left_stick_x_axis(): number { return this.gamepad.axes[0]; }
    get left_stick_y_axis(): number { return this.gamepad.axes[1]; }

    
}

export class OculusTouchRightGamepadInput extends GamepadInput {
    //these buttons don't exist on the right controller
    get x_gamepad_button(): GamepadButton { return undefined; }
    get y_gamepad_button(): GamepadButton { return undefined; }
    get left_stick_gamepad_button(): GamepadButton { return undefined; }
    get left_trigger_gamepad_button(): GamepadButton { return undefined; }
    get left_squeeze_gamepad_button(): GamepadButton { return undefined; }
    get left_stick_x_axis(): number { return undefined; }
    get left_stick_y_axis(): number { return undefined; }
    get a_gamepad_button(): GamepadButton { return this.gamepad.buttons[4] }
    get b_gamepad_button(): GamepadButton { return this.gamepad.buttons[5] }

    get right_stick_gamepad_button(): GamepadButton { return this.gamepad.buttons[3] }
    get right_trigger_gamepad_button(): GamepadButton { return this.gamepad.buttons[0] }

    get right_squeeze_gamepad_button(): GamepadButton { return this.gamepad.buttons[1] }

    get right_stick_x_axis(): number { return this.gamepad.axes[0]; }
    get right_stick_y_axis(): number { return this.gamepad.axes[1]; }  
}