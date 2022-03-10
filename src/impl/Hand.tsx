
import {h} from '../engine/JSX';

export interface HandComponent{
    joint_name : string
}

export const HandEntity = (
    <entity joint_name="wrist">
        // thumb
        <entity joint_name='thumb-metacarpal'/>
        <entity joint_name='thumb-phalanx-proximal'/>
        <entity joint_name='thumb-phalanx-distal'/>
        <entity joint_name='thumb-tip'/>

        // index
        <entity joint_name='index-finger-metacarpal'/>
        <entity joint_name='index-finger-phalanx-proximal'/>
        <entity joint_name='index-finger-phalanx-intermediate'/>
        <entity joint_name='index-finger-phalanx-distal'/>
        <entity joint_name='index-finger-tip'/>

        // middle
        <entity joint_name='middle-finger-metacarpal'/>
        <entity joint_name='middle-finger-phalanx-proximal'/>
        <entity joint_name='middle-finger-phalanx-intermediate'/>
        <entity joint_name='middle-finger-phalanx-distal'/>
        <entity joint_name='middle-finger-tip'/>

        // ring
        <entity joint_name='ring-finger-metacarpal'/>
        <entity joint_name='ring-finger-phalanx-proximal'/>
        <entity joint_name='ring-finger-phalanx-intermediate'/>
        <entity joint_name='ring-finger-phalanx-distal'/>
        <entity joint_name='ring-finger-tip'/>

        // pinky
        <entity joint_name='pinky-finger-metacarpal'/>
        <entity joint_name='pinky-finger-phalanx-proximal'/>
        <entity joint_name='pinky-finger-phalanx-intermediate'/>
        <entity joint_name='pinky-finger-phalanx-distal'/>
        <entity joint_name='pinky-finger-tip'/>


    </entity>
);