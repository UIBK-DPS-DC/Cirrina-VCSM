import {expect, test} from '@jest/globals';
import StateMachine from "../src/classes/statemachine"
import StateOrStatemachine from '../src/classes/stateOrStatemachine';

test("Statemachine names should be unique", () => {
    const statemachineName: string = "name"
    var res = StateMachine.registerName(statemachineName)
    expect(res).toBe(true)

    res = StateMachine.registerName(statemachineName)
    expect(res).toBe(false)

    StateOrStatemachine.unregisterName(statemachineName)
    expect(StateOrStatemachine.isNameUnique(statemachineName)).toBe(true)

})

test("Statemachine names should register correctly", () => {
    const names: string[] = ["name", "name1", "name2"]

    names.forEach( (e) => {
        expect(StateOrStatemachine.registerName(e)).toBe(true)
    })

    names.forEach((e) => {
        expect(StateOrStatemachine.registerName(e)).toBe(false)
        StateOrStatemachine.unregisterName(e)
        expect(StateOrStatemachine.isNameUnique(e)).toBe(true)
    })

})






