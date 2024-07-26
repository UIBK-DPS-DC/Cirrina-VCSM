import {Node} from "@xyflow/react";
import {CsmNodeProps} from "./types.ts";

function nodeIsEqual(node1: Node<CsmNodeProps>, node2: Node<CsmNodeProps>): boolean {
    console.log(`NODE1: ${node1} , NODE2: ${node2}`);
    return node1.id === node2.id;
}


export {nodeIsEqual}

