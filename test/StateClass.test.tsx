import {expect, test} from '@jest/globals';
import { StateClass } from '../src/classes/StateClass';

test("Registering and deregistering a state name should work correctly", () => {
    const name1 = "name1";
    const name2 = "name2";

    StateClass.registerName(name1);
    StateClass.registerName(name2);

    expect(StateClass.nameIsUnique(name1)).toBeFalsy();
    expect(StateClass.nameIsUnique(name2)).toBeFalsy();

    StateClass.unregisterName(name1);
    StateClass.unregisterName(name2);

    expect(StateClass.nameIsUnique(name1)).toBeTruthy();
    expect(StateClass.nameIsUnique(name2)).toBeTruthy();


})

