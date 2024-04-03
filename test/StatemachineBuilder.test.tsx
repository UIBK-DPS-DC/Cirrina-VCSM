import {StatemachineBuilder} from "../src/classes/builders/StatemachineBuilder"
import { StateClass } from "../src/classes/StateClass";
import { StateBuilder } from "../src/classes/builders/StateBuilder";
import {expect, test, beforeEach} from '@jest/globals';
import { StateOrStatemachineClass } from "../src/classes/Interfaces";
const statemachineBuilder = new StatemachineBuilder();
const stateBuilder = new StateBuilder();

beforeEach(() => {
    statemachineBuilder.reset()
    stateBuilder.reset()
})


test("The StatemachineBuilder should throw an error undefined when a no name or states are set", () => {
    const stateMachineName: string = "name";
    const state: StateClass  = stateBuilder.setName(stateMachineName).build();
    const stateMachines: Array<StateOrStatemachineClass> = new Array<StateOrStatemachineClass>(state); 
    expect(() => {
        statemachineBuilder.build()
    }).toThrow();

    statemachineBuilder.reset();
    statemachineBuilder.setName(stateMachineName);

    expect(() => {
        statemachineBuilder.build()
    }).toThrow();

    statemachineBuilder.reset();
    statemachineBuilder.setStates(stateMachines);

    expect(() => {
        statemachineBuilder.build()
    }).toThrow();

    statemachineBuilder.reset();
    statemachineBuilder.setName(stateMachineName);
    statemachineBuilder.setStates(stateMachines);

    expect(() => {
        statemachineBuilder.build()
    }).not.toThrow();







    
    

})

