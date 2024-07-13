import { NodeProps, Handle, Position } from '@xyflow/react';
import { StateMachineProps } from '../types';
import "../css/stateMachineNode.css"

export default function StateMachineNode({data}: NodeProps<StateMachineProps>){
    return (
        <div className='state-machine-node'>
            <div>
                <Handle
                id = {data.stateMachine.getName()} // TODO: This needs to updateable on the fly. Use React State hooks
                type='target'
                position= {Position.Top}
                isConnectable = {true}/>
            </div>

            <p>{data.stateMachine.getName()}</p>

            <div>
                <Handle
                id = {data.stateMachine.getName()}
                type= "source"
                position= {Position.Bottom}
                isConnectable= {true}/>
            </div>

        </div>
        
    )
}

