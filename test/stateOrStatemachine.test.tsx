import {expect, test} from '@jest/globals';
import Statemachine from "../src/classes/stateOrStatemachine"

test("Statemachine names should be unique", () => {
    const statemachineName: string = "name"
    var res = Statemachine.registerName(statemachineName)
    expect(res).toBe(true)

    res = Statemachine.registerName(statemachineName)
    expect(res).toBe(false)

})





