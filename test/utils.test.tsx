import {CsmNodeProps, RaiseEventActionProps} from "../src/types";
import {Node} from "@xyflow/react";
import {
    generateRaisedToConsumedInfoStrings,
    getAllStatemachineDescendants,
    getConsumedEventsToStateMap,
    getMostDistantAncestorNode,
    getParentNode,
    getRaisedEventsToStateMap
} from "../src/utils";
import StateMachine from "../src/classes/stateMachine";
import State from "../src/classes/state";
import {ActionType, EventChannel} from "../src/enums";
import Event from "../src/classes/event"
import Transition from "../src/classes/transition";
import Action from "../src/classes/action";

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

describe('Utils - Event Maps', () => {
    describe('getRaisedEventsToStateMap', () => {
        it('should return an empty map when no nodes are provided', () => {
            const nodes: Node<CsmNodeProps>[] = [];
            const raisedEventsMap = getRaisedEventsToStateMap(nodes);

            expect(raisedEventsMap.size).toBe(0);
        });

        it('should correctly map raised events to their respective states', () => {
            // Mock Events
            const event1 = new Event('Event1', EventChannel.INTERNAL);
            const event2 = new Event('Event2', EventChannel.GLOBAL);

            // Mock States
            const state1 = new State('State1');
            jest.spyOn(state1, 'getAllRaisedEvents').mockReturnValue([event1]);

            const state2 = new State('State2');
            jest.spyOn(state2, 'getAllRaisedEvents').mockReturnValue([event2]);

            // Mock Nodes
            const nodes: Node<CsmNodeProps>[] = [
                { id: '1', data: { state: state1 }, position: { x: 0, y: 0 }, type: 'state-node' },
                { id: '2', data: { state: state2 }, position: { x: 0, y: 0 }, type: 'state-node' },
            ];

            const raisedEventsMap = getRaisedEventsToStateMap(nodes);

            expect(raisedEventsMap.size).toBe(2);
            expect(raisedEventsMap.get(state1)).toEqual([event1]);
            expect(raisedEventsMap.get(state2)).toEqual([event2]);
        });

        it('should not include nodes that are not states', () => {
            // Mock States
            const state = new State('State');
            jest.spyOn(state, 'getAllRaisedEvents').mockReturnValue([]);

            // Mock Nodes (include a non-state node)
            const nodes: Node<CsmNodeProps>[] = [
                { id: '1', data: { state: state }, position: { x: 0, y: 0 }, type: 'state-node' },
                // @ts-ignore
                { id: '2', data: { nonStateData: {} }, position: { x: 0, y: 0 }, type: 'non-state-node' },
            ];

            const raisedEventsMap = getRaisedEventsToStateMap(nodes);

            expect(raisedEventsMap.size).toBe(1);
            expect(raisedEventsMap.get(state)).toEqual([]);
        });
    });

    describe('getConsumedEventsToStateMap', () => {
        it('should return an empty map when no nodes are provided', () => {
            const nodes: Node<CsmNodeProps>[] = [];
            const consumedEventsMap = getConsumedEventsToStateMap(nodes);

            expect(consumedEventsMap.size).toBe(0);
        });

        it('should correctly map consumed events to their respective states', () => {
            // Mock States with consumed events
            const state1 = new State('State1');
            jest.spyOn(state1, 'getAllConsumedEvents').mockReturnValue(['Event1', 'Event2']);

            const state2 = new State('State2');
            jest.spyOn(state2, 'getAllConsumedEvents').mockReturnValue(['Event3']);

            // Mock Nodes
            const nodes: Node<CsmNodeProps>[] = [
                { id: '1', data: { state: state1 }, position: { x: 0, y: 0 }, type: 'state-node' },
                { id: '2', data: { state: state2 }, position: { x: 0, y: 0 }, type: 'state-node' },
            ];

            const consumedEventsMap = getConsumedEventsToStateMap(nodes);

            expect(consumedEventsMap.size).toBe(2);
            expect(consumedEventsMap.get(state1)).toEqual(['Event1', 'Event2']);
            expect(consumedEventsMap.get(state2)).toEqual(['Event3']);
        });

        it('should not include nodes that are not states', () => {
            // Mock States with consumed events
            const state = new State('State');
            jest.spyOn(state, 'getAllConsumedEvents').mockReturnValue(['Event1']);

            // Mock Nodes (include a non-state node)

            const nodes: Node<CsmNodeProps>[] = [
                { id: '1', data: { state: state }, position: { x: 0, y: 0 }, type: 'state-node' },
                // @ts-ignore
                { id: '2', data: { nonStateData: {} }, position: { x: 0, y: 0 }, type: 'non-state-node' },
            ];

            const consumedEventsMap = getConsumedEventsToStateMap(nodes);

            expect(consumedEventsMap.size).toBe(1);
            expect(consumedEventsMap.get(state)).toEqual(['Event1']);
        });
    });
});

// Define test cases
describe('generateRaisedToConsumedInfoStrings', () => {
    // Helper function to create a state node
    const createStateNode = (name: string, raisedEvents: string[], consumedEvents: string[]): Node<CsmNodeProps> => {
        const state = new State(name);

        // Set raised events for the state
        const events = raisedEvents.map(eventName => new Event(eventName, EventChannel.INTERNAL)); // Adjust the channel as needed
        state.entry = events.map(event => {
            const newAction = new Action("",ActionType.RAISE_EVENT)
            const raiseActionProps: RaiseEventActionProps = {
                event: event, type: ActionType.RAISE_EVENT

            }
            newAction.properties = raiseActionProps
            return newAction
        });

        // Set consumed events for the state
        state.on = consumedEvents.map(eventName => {
            const transition = new Transition(name, 'nextState');
            transition.setEvent(eventName);
            return transition;
        });

        return {
            id: `node-${name}`,
            type: 'default',
            position: { x: 0, y: 0 },
            data: { state },
        };
    };

    it('should return the correct info strings when events are raised and consumed', () => {
        // Create nodes with raised and consumed events
        const nodeA = createStateNode('A', ['event1', 'event2'], ['event3']);
        const nodeB = createStateNode('B', ['event3'], ['event1', 'event4']);
        const nodeC = createStateNode('C', ['event4'], ['event2', 'event5']);

        // Pass nodes to the function
        const result = generateRaisedToConsumedInfoStrings([nodeA, nodeB, nodeC]);

        // Expected output based on the raised and consumed events
        expect(result).toEqual([
            'Event event1 raised by state A is consumed by a transition out of state B',
            'Event event2 raised by state A is consumed by a transition out of state C',
            'Event event3 raised by state B is consumed by a transition out of state A',
            'Event event4 raised by state C is consumed by a transition out of state B',
        ]);
    });

    it('should return an empty array when no events are raised and consumed', () => {
        // Create nodes with no matching raised and consumed events
        const nodeA = createStateNode('A', ['eventX'], ['eventY']);
        const nodeB = createStateNode('B', ['eventZ'], ['eventW']);

        // Pass nodes to the function
        const result = generateRaisedToConsumedInfoStrings([nodeA, nodeB]);

        // Expected output is empty since no events match
        expect(result).toEqual([]);
    });

    it('should handle nodes with empty event lists', () => {
        // Create nodes with empty raised and consumed events
        const nodeA = createStateNode('A', [], []);
        const nodeB = createStateNode('B', ['event1'], []);

        // Pass nodes to the function
        const result = generateRaisedToConsumedInfoStrings([nodeA, nodeB]);

        // Expected output is empty since no events are consumed
        expect(result).toEqual([]);
    });
});





