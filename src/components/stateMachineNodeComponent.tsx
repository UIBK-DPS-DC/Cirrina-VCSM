import { NodeProps } from '@xyflow/react';
import { StateMachineProps } from '../types';
import "../css/stateMachineNode.css"


export default function StateMachineNode({data}: NodeProps<StateMachineProps>){
    return (
        <div className='state-machine-node'>
            <p>{data.stateMachine.getName()}</p>
        </div>
    )
}