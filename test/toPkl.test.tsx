import Guard from "../src/classes/guard";
import Action from "../src/classes/action";
import {ActionType} from "../src/enums";

describe('Guard.toPKL', () => {

    it('should serialize the Guard with a non-empty name and expression', () => {
        const guard = new Guard('a == 5', 'checkEquality');
        const expectedPKL = `{\n\texpression: "a == 5"\n}`;
        expect(guard.toPKL()).toBe(expectedPKL);
        console.log(guard.toPKL());
    });

    it('should serialize the Guard with only an expression', () => {
        const guard = new Guard('a == 5');
        const expectedPKL = `{\n\texpression: "a == 5"\n}`;
        expect(guard.toPKL()).toBe(expectedPKL);
        console.log(guard.toPKL())
    });

    it('should serialize the Guard with a complex expression', () => {
        const guard = new Guard('x > 10 && y < 20');
        const expectedPKL = `{\n\texpression: "x > 10 && y < 20"\n}`;
        expect(guard.toPKL()).toBe(expectedPKL);
        console.log(guard.toPKL());
    });

    it('should handle empty expression gracefully', () => {
        const guard = new Guard('');
        const expectedPKL = `{\n\texpression: ""\n}`;
        expect(guard.toPKL()).toBe(expectedPKL);
        console.log(guard.toPKL());
    });

    it("Raise event", () => {
        const action = new Action("Test",ActionType.RAISE_EVENT);
        action.properties = {event: "Event name"}
        console.log(action.toPKL());
    })

    it("Invoke event",()=>{
        const action = new Action("Test", ActionType.INVOKE)
        action.properties = {
            description: "description",
            serviceType: "Type",
            serviceLevel: "Service Level"
        }
        console.log(action.toPKL());
    })

    it("Create Action", ()=> {
        const action = new Action("Test", ActionType.CREATE);
        action.properties = {
            description: "description",
            variable: "variable a",
            value: "1",
            isPersistent: true
        }
        console.log(action.toPKL());
    })
    it("Assign Action", ()=> {
        const action = new Action("Test", ActionType.ASSIGN);
        action.properties = {
            variable:"Variable a",
            value: "1"
        }
        console.log(action.toPKL())
    })


});
