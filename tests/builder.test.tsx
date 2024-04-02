import {StateBuilder} from "../src/classes/builders/StateBuilder"
import {StateClass} from "../src/classes/StateClass"
test("The statebuilder's build function should return undefined if no name is set", () => {
    const stateBuilder: StateBuilder = new StateBuilder();
    const State: StateClass | undefined = stateBuilder.build();

    expect(State).toBeUndefined();

});