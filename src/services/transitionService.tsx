import {Connection} from "@xyflow/react";
import StateOrStateMachineService from "./stateOrStateMachineService.tsx";
import Transition from "../classes/transition.ts";


export default class TransitionService {
    private _stateOrStatemachineService: StateOrStateMachineService

    public constructor(stateOrStatemachineService: StateOrStateMachineService) {
        this._stateOrStatemachineService = stateOrStatemachineService;
    }

    /**
     * Creates a transition between two states or state machines based on the provided connection.
     *
     * This function retrieves the source and target states or state machines linked to the given connection.
     * If both the source and target states are found, it creates a new `Transition` object from the source to the target.
     * If either the source or target state is not found, it logs an error message and returns `undefined`.
     *
     * @param {Connection} connection - The connection object containing the source and target names.
     * @returns {Transition | undefined} - A new `Transition` object if both states are found, otherwise `undefined`.
     */
    public connectionToTransition(connection: Connection): Transition | undefined {
        const sourceName = connection.source
        const targetName = connection.target

        const sourceState = this._stateOrStatemachineService.getLinkedStateOrStatemachine(sourceName)
        const targetState = this._stateOrStatemachineService.getLinkedStateOrStatemachine(targetName)

        if(! (sourceState && targetState)) {
            if(! sourceState){
                console.error(`Source ${sourceName} not found`);
            }
            if(! targetState){
                console.error(`Source ${targetName} not found`);
            }
            return undefined;
        }

        const transition = new Transition(sourceState.name, targetState.name);
        console.log(`Transition created from ${sourceState.name} to ${targetState.name}`);
        return transition;



    }

}