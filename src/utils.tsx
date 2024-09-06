import {Node} from "@xyflow/react";
import {CsmNodeProps, OptionEnums, ReactFlowContextProps} from "./types.ts";
import {createContext} from "react";
import StateInfoForm from "./components/visualEditor/stateInfoForm.tsx";
import StateMachineInfoForm from "./components/visualEditor/stateMachineInfoForm.tsx";
import ContextVariable from "./classes/contextVariable.tsx";

export const ReactFlowContext = createContext<ReactFlowContextProps | null>(null);

function nodeIsEqual(node1: Node<CsmNodeProps>, node2: Node<CsmNodeProps>): boolean {
    console.log(`NODE1: ${node1} , NODE2: ${node2}`);
    return node1.id === node2.id;
}

export const renderEnumAsOptions = (enumObject: OptionEnums) => {
    return (
        Object.values(enumObject).map((value) => {
            return <option key={value} value={value}>{value.toUpperCase()}</option>
        })
    );
    
}

export const renderContextVariablesAsOptions = (vars: ContextVariable[]) => {
    return vars.map((variable) => {
        return(
            <option key={variable.name} value={variable.name}>{variable.name}</option>
        )
    })
}

export const renderStringsAsOptions = (strings: string[]) => {
    return strings.map((string) => {
        return (
            <option key={string} value={string}>{string}</option>
        )
    })
}

export function getNodeInfoForm(node: Node) {
    switch (node.type) {
        case "state-node":
            return StateInfoForm;
        case "state-machine-node":
            return StateMachineInfoForm;
    }
}


export {nodeIsEqual}

