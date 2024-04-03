import {StatemachineBuilder} from "../src/classes/builders/StatemachineBuilder"
import { StateClass } from "../src/classes/StateClass";
import { StateBuilder } from "../src/classes/builders/StateBuilder";
import {expect, test, beforeEach} from '@jest/globals';
import { StateOrStatemachineClass } from "../src/classes/Interfaces";
import { StatemachineClass } from "../src/classes/StatemachineClass";
import { ContextClass } from "../src/classes/context/ContextClass";

const statemachineBuilder = new StatemachineBuilder();
const stateBuilder = new StateBuilder();
const stateMachineName: string = "name";
const state: StateClass  = stateBuilder.setName(stateMachineName).build();
const states: Array<StateOrStatemachineClass> = new Array<StateOrStatemachineClass>(state); 

beforeEach(() => {
    statemachineBuilder.reset()
    stateBuilder.reset()
    statemachineBuilder
    .setName(stateMachineName)
    .setStates(states)

})


test("The StatemachineBuilder should throw an error undefined when a no name or states are set", () => {
    statemachineBuilder.reset();
    const stateMachineName: string = "name";
    const state: StateClass  = stateBuilder.setName(stateMachineName).build();
    const states: Array<StateOrStatemachineClass> = new Array<StateOrStatemachineClass>(state); 
    expect(() => {
        statemachineBuilder.build()
    }).toThrow();

    statemachineBuilder.reset();
    statemachineBuilder.setName(stateMachineName);

    expect(() => {
        statemachineBuilder.build()
    }).toThrow();

    statemachineBuilder.reset();
    statemachineBuilder.setStates(states);

    expect(() => {
        statemachineBuilder.build()
    }).toThrow();

    statemachineBuilder.reset();
    statemachineBuilder.setName(stateMachineName);
    statemachineBuilder.setStates(states);

    expect(() => {
        statemachineBuilder.build()
    }).not.toThrow();
    
})

test("The Statemachine builder should set the name and states correctly", () => {
    const stateMachineName: string = "name";
    const state: StateClass  = stateBuilder.setName(stateMachineName).build();
    const state2: StateClass  = stateBuilder.setName(stateMachineName).build();
    const states: Array<StateOrStatemachineClass> = new Array<StateOrStatemachineClass>([state,state2]); 

    const stateMachine: StatemachineClass = statemachineBuilder
    .setName(stateMachineName)
    .setStates(states)
    .build();

    expect(stateMachine.name).toBe(stateMachineName);

    states.forEach((x) => {
        expect(stateMachine.states).toContain(x);
    })
})

test("The Statemachine builder should set the local and persistent context correctly",(() => {
    const persistentContext = new ContextClass();
    const localContext = new ContextClass();
    
    const stateMachine = statemachineBuilder
    .setPersistentContext(persistentContext)
    .setLocalContext(localContext)
    .build();

    expect(stateMachine.persistentContext).toBe(persistentContext);
    expect(stateMachine.localContext).toBe(localContext);



}))




