import { Entity } from "../core/Entity";
import { Handedness, TrackedPointComponent } from "../impl/Input/XRInput";
import { RenderEntity } from "../impl/Renderer";
import { LocalTransformComponent, ParentEntity } from "../impl/Transformation";
import { float3 } from "../primitives";
import { Quaternion } from "../primitives/Quaternion";
import { Transform } from "../primitives/Transform";



async function Quest2() 
{
    const controllers : Entity & ParentEntity = await Entity.from_gltf_loader("quest2_mark2_controllers/") as Entity & ParentEntity;

    const left_controller : Entity & ParentEntity & RenderEntity & LocalTransformComponent = controllers.children[0] as unknown as Entity & ParentEntity & RenderEntity & LocalTransformComponent;
    
    left_controller.local_transform = Transform.fromPositionRotationScale(new float3(0,0,-0.02), Quaternion.fromEulerXYZ(0,180,0), new float3(1,1,1));
    left_controller.local_transform.rotation = left_controller.local_transform.rotation.multiply(Quaternion.fromEulerXYZ(45,0,0));
    

    
    const left_controller_tracked_point : Entity & TrackedPointComponent & ParentEntity = 
    {
        id: undefined,
        name: "ol lefty",
        handedness : Handedness.Left,
        point_name : "left-controller",
        joint_space : undefined,
        isHand : false,
        transform : Transform.fromPositionRotationScale(new float3(1,1,1), Quaternion.identity, new float3(1,1,1)),
        children : [left_controller],
        needs_transform_update : true
    }

    const right_controller : Entity & ParentEntity & RenderEntity & LocalTransformComponent & TrackedPointComponent = controllers.children[1] as unknown as Entity & ParentEntity & RenderEntity & LocalTransformComponent & TrackedPointComponent;

    right_controller.local_transform = Transform.fromPositionRotationScale(new float3(0,0,-0.02), Quaternion.fromEulerXYZ(0,180,0), new float3(1,1,1));
    right_controller.local_transform.rotation = right_controller.local_transform.rotation.multiply(Quaternion.fromEulerXYZ(45,0,0));

    const right_controller_tracked_point : Entity & TrackedPointComponent & ParentEntity =
    {
        id: undefined,
        name: "ol righty",
        handedness : Handedness.Right,
        point_name : "right-controller",
        joint_space : undefined,
        isHand : false,
        transform : Transform.fromPositionRotationScale(new float3(1,1,1), Quaternion.identity, new float3(1,1,1)),
        children : [right_controller],
        needs_transform_update : true
    }

    return [left_controller_tracked_point, left_controller, right_controller, right_controller_tracked_point];
}

export const Quest2Controllers = Quest2();