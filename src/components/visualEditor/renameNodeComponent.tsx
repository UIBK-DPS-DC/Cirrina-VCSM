import {useContext, useEffect, useState} from "react";
import {ReactFlowContext} from "../../utils.ts";
import {ReactFlowContextProps} from "../../types.ts";

export default function RenameNodeComponent() {
    const INPUT_FIELD_NAME = "placeholder"
    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const [nodeNameInput, setNodeNameInput] = useState<string>("");
    const {
        selectedNode,
        stateOrStateMachineService
    } = context;


    useEffect(() => {
        if (selectedNode) {
            setNodeNameInput(stateOrStateMachineService.getName(selectedNode.data));
        }
    }, [selectedNode, stateOrStateMachineService]);

    return (
        <div className={"rename-node-form-container"}>
            <form>
                <input type={"text"} name={INPUT_FIELD_NAME} value={nodeNameInput}/>
            </form>
        </div>
    )
}