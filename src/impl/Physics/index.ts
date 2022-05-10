//TODO: export the systems and make sure the wiring works

import { ColliderComponent, ColliderEntity, ColliderSystem, getCollisionMask } from "./ColliderSystem";
import { JointComponent, JointEntity, JointSystem } from "./JointSystem";
import { RigidbodyComponent, RigidbodyEntity, RigidbodySystem } from "./RigidbodySystem";


export {
    RigidbodySystem,
    RigidbodyEntity,
    RigidbodyComponent,
    JointEntity,
    JointComponent,
    JointSystem,
    ColliderSystem,
    ColliderEntity,
    ColliderComponent,
    getCollisionMask,
}






