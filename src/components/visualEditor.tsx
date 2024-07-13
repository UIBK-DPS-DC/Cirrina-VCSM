import Flow from "./flow.tsx";
import FlowSideBar from "./flowSideBar.tsx";
import {ReactFlowProvider} from "@xyflow/react";


export default function VisualEditor () {
    return (
        <ReactFlowProvider>
            <FlowSideBar/>
            <Flow/>
        </ReactFlowProvider>
    )
}