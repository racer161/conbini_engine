import { float2 } from "../../../primitives/float2";

export abstract class GamepadInput {

    gamepad: Gamepad;

    abstract get x_gamepad_button(): GamepadButton | undefined;
    abstract get y_gamepad_button(): GamepadButton | undefined;
    abstract get a_gamepad_button(): GamepadButton | undefined;
    abstract get b_gamepad_button(): GamepadButton | undefined;

    abstract get left_stick_gamepad_button(): GamepadButton | undefined;
    abstract get right_stick_gamepad_button(): GamepadButton | undefined;

    abstract get left_trigger_gamepad_button(): GamepadButton | undefined;
    abstract get right_trigger_gamepad_button(): GamepadButton | undefined;

    abstract get left_squeeze_gamepad_button(): GamepadButton | undefined;
    abstract get right_squeeze_gamepad_button(): GamepadButton | undefined;

    abstract get left_stick_x_axis(): number | undefined;
    abstract get left_stick_y_axis(): number | undefined;

    abstract get right_stick_x_axis(): number | undefined;
    abstract get right_stick_y_axis(): number | undefined;

    constructor(gamepad: Gamepad) {
        this.gamepad = gamepad;
    }

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