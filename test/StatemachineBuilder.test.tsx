import {StatemachineBuilder} from "../src/classes/builders/StatemachineBuilder"
import { StateClass } from "../src/classes/StateClass";
import { StateBuilder } from "../src/classes/builders/StateBuilder";
import {expect, test, beforeEach} from '@jest/globals';
import { ActionOrActionReferenceClass, StateOrStatemachineClass } from "../src/classes/Interfaces";
import { StatemachineClass } from "../src/classes/StatemachineClass";
import { ContextClass } from "../src/classes/context/ContextClass";
import { GuardClass } from "../src/classes/guard/GuardClass";
import { ActionReferenceClass } from "../src/classes/action/ActionReferenceClass";

const statemachineBuilder = new StatemachineBuilder();
const stateBuilder = new StateBuilder();
const stateMachineName: string = "name";
const state: StateClass  = stateBuilder.setName(stateMachineName).build();
const states: Array<StateOrStatemachineClass> = new Array<StateOrStatemachineClass>(state); 

beforeEach(() => {
    statemachineBuilder.reset()
    stateBuilder.reset()
    stateBuilder.setName(stateMachineName);
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

test("The Statemachine builder should set the guards and actions correctly", () => {
    const guardExpression = "expression";
    const guard1 = new GuardClass(guardExpression);
    const guard2 = new GuardClass(guardExpression);
    const guards: Array<GuardClass> = new Array<GuardClass>();
    guards.push(guard1);
    guards.push(guard2);

    const referenceName: string = "name";
    const action1: ActionReferenceClass = new ActionReferenceClass(referenceName);
    const action2: ActionReferenceClass = new ActionReferenceClass(referenceName);
    const action3: ActionReferenceClass = new ActionReferenceClass(referenceName);

    const actions: Array<ActionOrActionReferenceClass> = new Array<ActionOrActionReferenceClass>();
    actions.push(action1);
    actions.push(action2);
    actions.push(action3);

    const stateMachine: StatemachineClass = statemachineBuilder
    .setGuards(guards)
    .setActions(actions)
    .build();

    guards.forEach(
        (x) => {
            expect(stateMachine.guards).toContain(x);
        }
    )

    actions.forEach(
        (x) => {
          expect(stateMachine.actions).toContain(x);  
        }
    )
})


test("The statemachine builder should set the inherit property correctly", () => {
    const inheritedMachineName: string = "name";
    const stateMachine: StatemachineClass = statemachineBuilder.setInherit(inheritedMachineName).build();

    expect(stateMachine.inherit).toBe(inheritedMachineName);
})

test("The statemachine should set the isAbstract value correctly", () => {
    let value: boolean = true;
    let stateMachine: StatemachineClass = statemachineBuilder.setIsAbstract(value).build();

    expect(stateMachine.isAbstract).toBe(value);

    value = false;
    stateBuilder.reset();

    stateMachine = statemachineBuilder.setIsAbstract(value).build();
    expect(stateMachine.isAbstract).toBe(value);





})




