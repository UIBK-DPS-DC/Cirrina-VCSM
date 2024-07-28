import {Connection} from "@xyflow/react";
import StateOrStateMachineService from "./stateOrStateMachineService.tsx";
import Transition from "../classes/transition.ts";


export default class TransitionService {
    private _stateOrStatemachineService: StateOrStateMachineService

    public constructor(stateOrStatemachineService: StateOrStateMachineService) {
        this._stateOrStatemachineService = stateOrStatemachineService;
    }

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

        const transition = new Transition(sourceState, targetState);
        console.log(`Transition created from ${sourceState} to ${targetState}`);
        return transition;



    }


}