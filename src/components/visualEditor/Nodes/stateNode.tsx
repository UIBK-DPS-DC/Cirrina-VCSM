import { Handle, NodeProps, Position } from "@xyflow/react";
import { ReactFlowContextProps, type StateNode } from "../../../types.ts";
import { useContext, useEffect, useMemo } from "react";
import { ReactFlowContext } from "../../../utils.tsx";
import "../../../StateNode.css";

export function StateNode({ data }: NodeProps<StateNode>) {
    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {selectedNode, initialOrTerminalChange, setInitialOrTerminalChange } = context;

    // Use useMemo to compute the className based on the state changes
    const border = useMemo(() => {
        if (data.state.terminal) {
            return "neonBorderRed";
        }
        if (data.state.initial) {
            return "neonBorder";
        }
        return "";
    }, [initialOrTerminalChange, setInitialOrTerminalChange]);

    // Optional: Add this effect to log when the state changes, if needed for debugging
    useEffect(() => {
        console.log(`Initial: ${data.state.initial}, Terminal: ${data.state.terminal}`);
    }, [data.state.initial, data.state.terminal, selectedNode]);

    return (
        <div className={`react-flow__node-default ${border}`}>
            <Handle type={"target"} position={Position.Top} id={"a"} />
            <Handle
                type={"source"}
                position={Position.Top}
                id={"s"}
                style={{ visibility: "hidden", left: "30%" }}
            />
            {data.state.name && <div>{data.state.name}</div>}
            <Handle
                type={"target"}
                position={Position.Left}
                id={"t"}
                style={{ visibility: "hidden", top: "50%" }}
            />
            <Handle type={"source"} position={Position.Bottom} id={"b"} />
        </div>
    );
}
