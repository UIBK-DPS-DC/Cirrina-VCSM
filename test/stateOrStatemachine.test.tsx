import {expect, test} from '@jest/globals';
import StateMachine from "../src/classes/statemachine"

test("Statemachine names should be unique", () => {
    const statemachineName: string = "name"
    var res = StateMachine.registerName(statemachineName)
    expect(res).toBe(true)

    res = StateMachine.registerName(statemachineName)
    expect(res).toBe(false)

})






