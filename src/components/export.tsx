import {useCallback, useContext} from "react";
import {ReactFlowContext} from "./flow.tsx";
import {ReactFlowContextProps} from "../types.ts";

export default function Export () {
    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {nodes, edges} = context;

    const onButtonClick = useCallback(() => {
        console.log("Nodes")
        nodes.forEach((node) => {
            console.log(node.id)
        })
        console.log("Edges")
        edges.forEach((edge) => {
            console.log(edge.id)
        })
    },[nodes,edges])

    return(
        <button onClick={onButtonClick}>Export test</button>
    )


}