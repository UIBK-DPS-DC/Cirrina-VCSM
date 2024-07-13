import {expect, test} from '@jest/globals';
import StateMachine from "../src/classes/stateMachine"
import StateOrStateMachine from '../src/classes/stateOrStateMachine';

test("Statemachine names should be unique", () => {
    const statemachineName: string = "name"
    var res = StateMachine.registerName(statemachineName)
    expect(res).toBe(true)

    res = StateMachine.registerName(statemachineName)
    expect(res).toBe(false)

    StateOrStateMachine.unregisterName(statemachineName)
    expect(StateOrStateMachine.isNameUnique(statemachineName)).toBe(true)

})

test("Statemachine names should register correctly", () => {
    const names: string[] = ["name", "name1", "name2"]

    names.forEach( (e) => {
        expect(StateOrStateMachine.registerName(e)).toBe(true)
    })

    names.forEach((e) => {
        expect(StateOrStateMachine.registerName(e)).toBe(false)
        StateOrStateMachine.unregisterName(e)
        expect(StateOrStateMachine.isNameUnique(e)).toBe(true)
    })

})






