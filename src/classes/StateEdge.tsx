import { EdgeProps } from "reactflow";
import { EdgeData } from "./types";
import { BaseEdge, getSmoothStepPath} from 'reactflow';

export function StateEdge(props: EdgeProps<EdgeData>){
    const [edgePath] = getSmoothStepPath(props)

    return(
        <BaseEdge id = {props.id} path = {edgePath}></BaseEdge>
    )



       
}