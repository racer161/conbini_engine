import { float2 } from "../../primitives/float2";

export abstract class GamepadInput {
    abstract get x_button(): boolean;
    abstract get y_button(): boolean;
    abstract get a_button(): boolean;
    abstract get b_button(): boolean;
    abstract get start_button(): boolean;
    abstract get select_button(): boolean;
    abstract get left_stick_button(): boolean;
    abstract get right_stick_button(): boolean;
    abstract get left_bumper(): boolean;
    abstract get right_bumper(): boolean;
    abstract get left_trigger(): number;
    abstract get right_trigger(): number;
    abstract get left_stick(): float2;
    abstract get right_stick(): float2;
    abstract get dpad(): float2;
}