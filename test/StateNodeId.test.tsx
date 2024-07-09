import {expect, test} from '@jest/globals';
import {StateNameNumber} from "../src/classes/StateNode"

test("Get current id should not increment the counter of StateNameNumber",() => {
    const id: number = StateNameNumber.getCurrentNumber();
    expect(id).toBe(StateNameNumber.getCurrentNumber());

})

test("Get new id should generate a new id when called", () => {
    const id: number = StateNameNumber.getNewNumber();
    expect(id === StateNameNumber.getNewNumber()).toBeFalsy();

})