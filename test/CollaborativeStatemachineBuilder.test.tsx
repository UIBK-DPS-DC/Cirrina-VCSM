import {expect, test, beforeEach} from '@jest/globals';
import { StatemachineBuilder } from '../src/classes/builders/StatemachineBuilder';
import { StatemachineClass } from '../src/classes/StatemachineClass';
import { StateBuilder } from '../src/classes/builders/StateBuilder';
import { StateClass } from '../src/classes/StateClass';
import { StateOrStatemachineClass } from '../src/classes/Interfaces';
import{CollaborativeStatemachineBuilder} from "../src/classes/builders/CollaborativeStatemachineBuilder"
import { MemoryMode, Version } from '../src/classes/Enums';
import { ContextClass } from '../src/classes/context/ContextClass';

const stateMachineBuilder: StatemachineBuilder = new StatemachineBuilder();
const stateBuilder: StateBuilder = new StateBuilder();
const stateName: string = "state";
const statemachineName: string = "statemachine";
const collaborativeStatemachineName = "collaborativeStatemachineName";
const state: StateClass = stateBuilder.setName(stateName).build();
const states: Array<StateOrStatemachineClass> = new Array<StateOrStatemachineClass>(state);
const stateMachine: StatemachineClass = stateMachineBuilder.setName(statemachineName).setStates(states).build();
const stateMachines: Array<StatemachineClass> = new Array<StatemachineClass>(stateMachine);
const collaborativeStatemachineBuilder: CollaborativeStatemachineBuilder = new CollaborativeStatemachineBuilder();


beforeEach(() => {
    collaborativeStatemachineBuilder.reset();
    collaborativeStatemachineBuilder
    .setName(collaborativeStatemachineName)
    .setStatemachines(stateMachines)
    .setVersion(Version.ZERO_ONE)
    .setMemoryMode(MemoryMode.SHARED);
})


test("The Collaborative Statemachine builder should throw an error on invalid Collaborative Statemachines",(() => {
    collaborativeStatemachineBuilder.reset();

    expect(() => {
        collaborativeStatemachineBuilder.build()
    }).toThrow();

    collaborativeStatemachineBuilder.reset()
    collaborativeStatemachineBuilder.setName(collaborativeStatemachineName);

    expect(() => {
        collaborativeStatemachineBuilder.build()
    }).toThrow();
    collaborativeStatemachineBuilder.reset()
    collaborativeStatemachineBuilder
    .setName(collaborativeStatemachineName)
    .setStatemachines(stateMachines);

    expect(() => {
        collaborativeStatemachineBuilder.build()
    }).toThrow();


    collaborativeStatemachineBuilder.reset()
    collaborativeStatemachineBuilder
    .setName(collaborativeStatemachineName)
    .setStatemachines(stateMachines)
    .setVersion(Version.ZERO_ONE)

    expect(() => {
        collaborativeStatemachineBuilder.build()
    }).toThrow();

    collaborativeStatemachineBuilder.reset()
    collaborativeStatemachineBuilder
    .setName(collaborativeStatemachineName)
    .setStatemachines(stateMachines)
    .setVersion(Version.ZERO_ONE)
    .setMemoryMode(MemoryMode.SHARED);


    expect(() => {
        collaborativeStatemachineBuilder.build()
    }).not.toThrow();
}))


test("The Collaborative Statemachine builder should set the local and persistent context correctly",() => {
    const localContext = new ContextClass();
    const persistentContext = new ContextClass();
    const collaborativeStatemachine = collaborativeStatemachineBuilder
    .setLocalContext(localContext)
    .setPersistentContext(persistentContext)
    .build();

    expect(collaborativeStatemachine.localContext).toBe(localContext);
    expect(collaborativeStatemachine.persistentContext).toBe(persistentContext);

    

})