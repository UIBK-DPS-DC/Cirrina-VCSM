import {StateBuilder} from "../src/classes/builders/StateBuilder"
import {StateClass} from "../src/classes/StateClass"
import {ActionReferenceClass} from "../src/classes/action/ActionReferenceClass"
import { ActionOrActionReferenceClass } from "../src/classes/Interfaces";
import { OnTransitionClass } from "../src/classes/transition/OnTransitionClass";
import { TransitionClass } from "../src/classes/transition/TransitionClass";
import { ContextClass } from "../src/classes/context/ContextClass";
import {expect, test, beforeEach} from '@jest/globals';

let stateBuilder = new StateBuilder();
const stateName: string = "state";

beforeEach(() => {
    stateBuilder.reset();
    stateBuilder.setName(stateName);
  });

test("The statebuilder's build function should throw an error if no name is set", () => {
    stateBuilder.reset();
    expect(() => {
        stateBuilder.build()
    }).toThrow();

});

test("The statebuilder's reset function should reset the internal state to a new state object", () => {
    const stateName: string = "stateName";
    const state1: StateClass | undefined = stateBuilder.setName(stateName).build();

    stateBuilder.reset();
    const state2: StateClass | undefined = stateBuilder.setName(stateName).build();

    expect(state1 === state2).toBeFalsy()
    
})

test("The statebuilders set function for isTerminal and isInitial should initialize the properties correctly", () => {
    let isInitial = true;
    let isTerminal = false;

    let state = stateBuilder.
    setIsInitial(isInitial)
    .setIsTerminal(isTerminal)
    .build();

    expect(state?.isInitial == isInitial);
    expect(state?.isTerminal == isTerminal);

    isInitial = false;
    isTerminal = true;

    stateBuilder.reset();
    state = stateBuilder
    .setIsInitial(isInitial)
    .setIsTerminal(isTerminal)
    .setName("name")
    .build();

    expect(state?.isInitial == isInitial);
    expect(state?.isTerminal == isTerminal);
    
})

test("The statebuilder should initialize actions in the state correctly",() => {
    const referenceName: string = "name";
    const action1: ActionReferenceClass = new ActionReferenceClass(referenceName);
    const action2: ActionReferenceClass = new ActionReferenceClass(referenceName);
    const action3: ActionReferenceClass = new ActionReferenceClass(referenceName);

    const entryActions: Array<ActionOrActionReferenceClass> = new Array<ActionOrActionReferenceClass>();
    entryActions.push(action1);

    const exitActions: Array<ActionOrActionReferenceClass> = new Array<ActionOrActionReferenceClass>();
    exitActions.push([action1,action2]);

    const whileActions: Array<ActionOrActionReferenceClass> = new Array<ActionOrActionReferenceClass>();
    whileActions.push([action1,action2,action3]);

    const state: StateClass = stateBuilder
    .setEntryActions(entryActions)
    .setExitActions(exitActions)
    .setWhileActions(whileActions)
    .build();

    if(state != undefined){
        entryActions.forEach((x) => {
            expect(state.entry).toContain(x)
        })
    
        exitActions.forEach((x) => {
            expect(state.exit).toContain(x)
        })
    
        whileActions.forEach((x) => {
            expect(state.while).toContain(x)
        })
    }
    else{
        console.log("State initialization failed");
        expect(false);
    }})

test("The statebuilder should initialize transitions in the state correctly", () => {
    const onTransition: Array<OnTransitionClass> = new Array<OnTransitionClass>();
    const alwaysTransitions: Array<TransitionClass> = new Array<TransitionClass>();

    const ot1 = new OnTransitionClass();
    const ot2 = new OnTransitionClass();

    const at1 = new TransitionClass();
    const at2 = new TransitionClass();
    const at3 = new TransitionClass();

    onTransition.push(ot1);
    onTransition.push(ot2);

    alwaysTransitions.push(at1);
    alwaysTransitions.push(at2);
    alwaysTransitions.push(at3);

    const state: StateClass | undefined = stateBuilder
    .setOnEventTransitions(onTransition)
    .setAlwaysTransitions(alwaysTransitions)
    .build();

    onTransition.forEach((x) => {
        expect(state?.on).toContain(x);
    })

    alwaysTransitions.forEach((x) => {
        expect(state?.always).toContain(x);
    })


})


test("The statebuilder should initialize the states context correctly", () => {
    const persistentContext = new ContextClass();
    const localContext = new ContextClass();

    const state: StateClass | undefined = stateBuilder
    .setPersistentContext(persistentContext)
    .setLocalContext(localContext)
    .build();

    expect(state?.persistentContext).toBe(persistentContext);
    expect(state?.localContext).toBe(localContext);


    
})

test("The statebuilder should initialize the states isVirtual and isAbstract fields correctly", () => {
    let isVirtual: boolean = true;
    let isAbstract: boolean = false;

    let state: StateClass | undefined = stateBuilder
    .setIsVirtual(isVirtual)
    .setIsAbstract(isAbstract)
    .build();

    expect(state?.isVirtual).toBe(isVirtual);
    expect(state?.isAbstract).toBe(isAbstract);

    stateBuilder.reset
    isVirtual = false;
    isAbstract = true;

    state = stateBuilder
    .setIsVirtual(isVirtual)
    .setIsAbstract(isAbstract)
    .build();

    expect(state?.isVirtual).toBe(isVirtual);
    expect(state?.isAbstract).toBe(isAbstract);




})


