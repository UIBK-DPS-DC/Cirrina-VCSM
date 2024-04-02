import {StateBuilder} from "../src/classes/builders/StateBuilder"
import {StateClass} from "../src/classes/StateClass"

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
    
}

)