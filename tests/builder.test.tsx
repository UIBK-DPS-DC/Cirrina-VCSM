import {StateBuilder} from "../src/classes/builders/StateBuilder"
import {StateClass} from "../src/classes/StateClass"
import {ActionReferenceClass} from "../src/classes/action/ActionReferenceClass"
import { ActionOrActionReferenceClass } from "../src/classes/Interfaces";

let stateBuilder = new StateBuilder();

beforeEach(() => {
    stateBuilder.reset();
  });

test("The statebuilder's build function should return undefined if no name is set", () => {
    const state: StateClass | undefined = stateBuilder.build();
    expect(state).toBeUndefined();

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

    const state: StateClass | undefined = stateBuilder
    .setEntryActions(entryActions)
    .setExitActions(exitActions)
    .setWhileActions(whileActions)
    .setName(referenceName)
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
    }

   






}

)