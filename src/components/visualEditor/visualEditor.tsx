import Flow from "./flow.tsx";
import FlowSideBar from "./flowSideBar.tsx";
import {ReactFlowProvider} from "@xyflow/react";

import "../../css/visualEditor.css"
import {useContext} from "react";
import {getNodeInfoForm, ReactFlowContext} from "../../utils.ts";
import {ReactFlowContextProps} from "../../types.ts";
import TransitionInfoForm from "./transitionInfoForm.tsx";


export default function VisualEditor () {

    const {
        selectedNode
    } = useContext(ReactFlowContext) as ReactFlowContextProps;


    const NodeInfoComponent = selectedNode ? getNodeInfoForm(selectedNode) : undefined;

    return (
        <ReactFlowProvider>
            <div className={"visualEditor"}>
                <FlowSideBar/>
                <Flow/>
                {selectedNode && NodeInfoComponent && (
                    <NodeInfoComponent />
                )}
                <TransitionInfoForm/>
            </div>
        </ReactFlowProvider>
    )
}