import {StateBuilder} from "../src/classes/builders/StateBuilder"
import {StateClass} from "../src/classes/StateClass"

test("The statebuilder's build function should return undefined if no name is set", () => {
    const stateBuilder: StateBuilder = new StateBuilder();
    const state: StateClass | undefined = stateBuilder.build();

    expect(state).toBeUndefined();

});

test("The statebuilder's reset function should reset the internal state to a new state object", () => {
    const stateBuilder: StateBuilder = new StateBuilder();
    const stateName: string = "stateName";
    const state1: StateClass | undefined = stateBuilder.setName(stateName).build();

    stateBuilder.reset();
    const state2: StateClass | undefined = stateBuilder.setName(stateName).build();

    expect(state1 === state2).toBeFalsy()
    
})