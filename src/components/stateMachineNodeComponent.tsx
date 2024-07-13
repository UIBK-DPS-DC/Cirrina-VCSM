import { NodeProps, Handle, Position } from '@xyflow/react';
import { StateMachineProps } from '../types';
import "../css/stateMachineNode.css"

export default function StateMachineNode({data}: NodeProps<StateMachineProps>){
    return (
        <div className='state-machine-node'>
            <div>
                <Handle
                id = {data.stateMachine.name} // TODO: This needs to updateable on the fly. Use React State hooks
                type='target'
                position= {Position.Top}
                isConnectable = {true}/>
            </div>

            <p>{data.stateMachine.name}</p>

            <div>
                <Handle
                id = {data.stateMachine.name}
                type= "source"
                position= {Position.Bottom}
                isConnectable= {true}/>
            </div>

        </div>
        
    )
}

