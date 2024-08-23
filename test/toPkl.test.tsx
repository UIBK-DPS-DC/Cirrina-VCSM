import Guard from "../src/classes/guard";

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

});
