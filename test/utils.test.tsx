import {CsmNodeProps} from "../src/types";
import {Node} from "@xyflow/react";
import {getAllStatemachineDescendants, getMostDistantAncestorNode, getParentNode} from "../src/utils";
import StateMachine from "../src/classes/stateMachine";
import State from "../src/classes/state";

describe('getParentNode', () => {

    let nodes: Node<CsmNodeProps>[];

    beforeEach(() => {
        // Setup some sample nodes to test against, using CsmNodeProps correctly
        nodes = [
            { id: '1', data: { stateMachine: new StateMachine('StateMachine1') }, parentId: undefined, type: 'state-machine-node', position: { x: 0, y: 0 } },
            { id: '2', data: { state: new State('State1') }, parentId: '1', type: 'state-node', position: { x: 0, y: 0 } },
            { id: '3', data: { state: new State('State2') }, parentId: '1', type: 'state-node', position: { x: 0, y: 0 } },
            { id: '4', data: { state: new State('State3') }, parentId: '2', type: 'state-node', position: { x: 0, y: 0 } },
        ];
    });

    it('should return the parent node if it exists', () => {
        const node = nodes[1]; // node with id '2'
        const parentNode = getParentNode(node, nodes);

        expect(parentNode).toEqual(nodes[0]); // Parent of node '2' is node '1'
    });

    it('should return undefined if the node has no parentId', () => {
        const node = nodes[0]; // node with id '1', which has no parentId
        const parentNode = getParentNode(node, nodes);

        expect(parentNode).toBeUndefined();
    });

    it('should return undefined if parent node does not exist in the nodes array', () => {
        const nodeWithMissingParent = { id: '5', data: { state: new State('State4') }, parentId: '999', type: 'state-node', position: { x: 0, y: 0 } }; // Parent ID is '999', which does not exist
        const parentNode = getParentNode(nodeWithMissingParent, nodes);

        expect(parentNode).toBeUndefined();
    });

    it('should return undefined if the nodes array is empty', () => {
        const node = nodes[1]; // node with id '2'
        const parentNode = getParentNode(node, []); // Empty nodes array

        expect(parentNode).toBeUndefined();
    });

    it('should return the correct parent node when there are multiple levels of hierarchy', () => {
        const node = nodes[3]; // node with id '4', whose parent is node '2'
        const parentNode = getParentNode(node, nodes);

        expect(parentNode).toEqual(nodes[1]); // Parent of node '4' is node '2'
    });

    it('should return undefined if node has a parentId but the node itself is not in the array', () => {
        const nodeNotInArray = { id: '999', data: { state: new State('MissingState') }, parentId: '1', type: 'state-node', position: { x: 0, y: 0 } };
        const parentNode = getParentNode(nodeNotInArray, nodes);

        expect(parentNode).toEqual(nodes[0]); // Should still return the correct parent if node is not present
    });

});

describe("getMostDistantAncestorNode", () => {
    const nodes: Node<CsmNodeProps>[] = [
        {
            id: "1",
            parentId: undefined,
            type: "state-node",
            data: { state: new State("Root") },
            position: { x: 0, y: 0 },
        },
        {
            id: "2",
            parentId: "1",
            type: "state-node",
            data: { state: new State("Child1") },
            position: { x: 0, y: 0 },
        },
        {
            id: "3",
            parentId: "2",
            type: "state-node",
            data: { state: new State("Child2") },
            position: { x: 0, y: 0 },
        },
        {
            id: "4",
            parentId: "3",
            type: "state-node",
            data: { state: new State("Child3") },
            position: { x: 0, y: 0 },
        },
    ];

    it("should return the root node if there is no parent", () => {
        const node = nodes[0]; // RootState
        const mostDistantAncestor = getMostDistantAncestorNode(node, nodes);
        expect(mostDistantAncestor).toEqual(node); // Should return itself as it's the root node
    });

    it("should return the root node for a node with one parent", () => {
        const node = nodes[1]; // ChildState1
        const mostDistantAncestor = getMostDistantAncestorNode(node, nodes);
        expect(mostDistantAncestor).toEqual(nodes[0]); // Should return RootState
    });

    it("should return the root node for a node with multiple ancestors", () => {
        const node = nodes[3]; // ChildState3
        const mostDistantAncestor = getMostDistantAncestorNode(node, nodes);
        expect(mostDistantAncestor).toEqual(nodes[0]); // Should return RootState
    });

    it("should handle nodes with no parent reference", () => {
        const orphanNode: Node<CsmNodeProps> = {
            id: "5",
            parentId: undefined,
            type: "state-node",
            data: { state: new State("Orphan sate") },
            position: { x: 0, y: 0 },
        };
        const mostDistantAncestor = getMostDistantAncestorNode(orphanNode, nodes);
        expect(mostDistantAncestor).toEqual(orphanNode); // Should return itself as it has no parent
    });

    it("should handle nodes that are not part of the hierarchy", () => {
        const unrelatedNode: Node<CsmNodeProps> = {
            id: "99",
            parentId: "unknown",
            type: "state-node",
            data: { state: new State("Unrelated") },
            position: { x: 0, y: 0 },
        };
        const mostDistantAncestor = getMostDistantAncestorNode(unrelatedNode, nodes);
        expect(mostDistantAncestor).toEqual(unrelatedNode); // Should return itself, as no matching parent is found
    });

    it("should handle cycles in the parent-child relationship", () => {
        const cyclicNodes: Node<CsmNodeProps>[] = [
            {
                id: "1",
                parentId: "2",
                type: "state-node",
                data: { state: new State("CyclicState1") },
                position: { x: 0, y: 0 },
            },
            {
                id: "2",
                parentId: "1",
                type: "state-node",
                data: { state: new State("CyclicState2") },
                position: { x: 0, y: 0 },
            },
        ];

        // In case of a cycle, the function would theoretically recurse indefinitely,
        // so this test expects the function to throw an error or handle cycles
        expect(() => getMostDistantAncestorNode(cyclicNodes[0], cyclicNodes)).toThrowError();
    });
});




describe('getAllStatemachineDescendants', () => {
    // Create some mock nodes with proper CsmNodeProps
    const nodes: Node<CsmNodeProps>[] = [
        {
            id: '1',
            parentId: undefined,
            type: 'state-machine-node',
            data: { stateMachine: new StateMachine('RootStateMachine') }, // StateMachine
            position: { x: 0, y: 0 }
        },
        {
            id: '2',
            parentId: '1',
            type: 'state-machine-node',
            data: { stateMachine: new StateMachine('ChildStateMachine1') }, // StateMachine
            position: { x: 0, y: 0 }
        },
        {
            id: '3',
            parentId: '1',
            type: 'state-node',
            data: { state: new State('ChildState1') }, // State
            position: { x: 0, y: 0 }
        },
        {
            id: '4',
            parentId: '2',
            type: 'state-machine-node',
            data: { stateMachine: new StateMachine('GrandChildStateMachine1') }, // StateMachine
            position: { x: 0, y: 0 }
        },
        {
            id: '5',
            parentId: '2',
            type: 'state-node',
            data: { state: new State('GrandChildState1') }, // State
            position: { x: 0, y: 0 }
        },
        {
            id: '6',
            parentId: '4',
            type: 'state-machine-node',
            data: { stateMachine: new StateMachine('GreatGrandChildStateMachine1') }, // StateMachine
            position: { x: 0, y: 0 }
        }
    ];

    it('should return an empty array when there are no state machine descendants', () => {
        const root = nodes[2]; // ChildState1 (state node, not state-machine)
        const result = getAllStatemachineDescendants(root, nodes);
        expect(result).toEqual([]);
    });

    it('should return direct child state-machine nodes', () => {
        const root = nodes[0]; // RootStateMachine
        const result = getAllStatemachineDescendants(root, nodes);
        expect(result[0].id).toEqual(nodes[1].id); // Only ChildStateMachine1 is a direct child
    });

    it('should return all nested state-machine descendants', () => {
        const root = nodes[0]; // RootStateMachine
        const result = getAllStatemachineDescendants(root, nodes);
        // Root -> ChildStateMachine1 -> GrandChildStateMachine1 -> GreatGrandChildStateMachine1
        expect([result[0].id, result[1].id, result[2].id]).toEqual([nodes[1].id, nodes[3].id, nodes[5].id]);
    });

    it('should return nested state-machine descendants for mid-level nodes', () => {
        const root = nodes[1]; // ChildStateMachine1
        const result = getAllStatemachineDescendants(root, nodes);
        // ChildStateMachine1 -> GrandChildStateMachine1 -> GreatGrandChildStateMachine1
        expect(result).toEqual([nodes[3], nodes[5]]);
    });

    it('should ignore non-state-machine nodes', () => {
        const root = nodes[0]; // RootStateMachine
        const result = getAllStatemachineDescendants(root, nodes);
        expect(result).not.toContain(nodes[2]); // ChildState1 is a state node, not a state-machine node
    });

    it('should handle deeply nested structures correctly', () => {
        const root = nodes[1]; // ChildStateMachine1
        const result = getAllStatemachineDescendants(root, nodes);
        expect([result[0].id, result[1].id]).toEqual([nodes[3].id, nodes[5].id]); // Get all descendants under ChildStateMachine1
    });

    it('should return an empty array for nodes without children', () => {
        const root = nodes[5]; // GreatGrandChildStateMachine1 (no children)
        const result = getAllStatemachineDescendants(root, nodes);
        expect(result).toEqual([]); // No further state machines under this node
    });


    it('should handle multiple state machines at the same level', () => {
        const nodesWithMultipleStateMachines: Node<CsmNodeProps>[] = [
            ...nodes,
            {
                id: '7',
                parentId: '1',
                type: 'state-machine-node',
                data: { stateMachine: new StateMachine('AnotherChildStateMachine') }, // Additional state-machine node
                position: { x: 0, y: 0 }
            }
        ];

        const root = nodesWithMultipleStateMachines[0]; // RootStateMachine
        const result = getAllStatemachineDescendants(root, nodesWithMultipleStateMachines);
        expect(result).toEqual([nodesWithMultipleStateMachines[1], nodesWithMultipleStateMachines[6], nodesWithMultipleStateMachines[3], nodesWithMultipleStateMachines[5]]);
    });
});





