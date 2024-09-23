import Guard from "../src/classes/guard";
import {GuardDescription} from "../src/pkl/bindings/collaborative_state_machine_description.pkl";


describe('Guard Class', () => {

    describe('toDescription Method', () => {

        it('should convert Guard to GuardDescription correctly', () => {
            const guard = new Guard('a == b');
            const description = guard.toDescription();

            expect(description).toEqual({
                expression: 'a == b',
            });
        });

        it('should handle empty expression', () => {
            const guard = new Guard('');
            const description = guard.toDescription();

            expect(description).toEqual({
                expression: '',
            });
        });

        it('should handle special characters in expression', () => {
            const guard = new Guard('x != y && z > 0');
            const description = guard.toDescription();

            expect(description).toEqual({
                expression: 'x != y && z > 0',
            });
        });

        it('should handle numeric expressions as strings', () => {
            const guard = new Guard('123 > 100');
            const description = guard.toDescription();

            expect(description).toEqual({
                expression: '123 > 100',
            });
        });
    });

    describe('fromDescription Method', () => {

        it('should convert GuardDescription to Guard correctly', () => {
            const description: GuardDescription = {
                expression: 'x > 5',
            };
            const guard = Guard.fromDescription(description);

            expect(guard).toBeInstanceOf(Guard);
            expect(guard.expression).toBe('x > 5');
        });

        it('should handle empty expression in description', () => {
            const description: GuardDescription = {
                expression: '',
            };
            const guard = Guard.fromDescription(description);

            expect(guard).toBeInstanceOf(Guard);
            expect(guard.expression).toBe('');
        });

        it('should handle special characters in expression in description', () => {
            const description: GuardDescription = {
                expression: 'a == 10 || b != 20',
            };
            const guard = Guard.fromDescription(description);

            expect(guard).toBeInstanceOf(Guard);
            expect(guard.expression).toBe('a == 10 || b != 20');
        });

        it('should handle numeric expressions as strings in description', () => {
            const description: GuardDescription = {
                expression: '50 < 100',
            };
            const guard = Guard.fromDescription(description);

            expect(guard).toBeInstanceOf(Guard);
            expect(guard.expression).toBe('50 < 100');
        });

        it('should handle long and complex expressions', () => {
            const longExpression = 'a == b && c != d || e >= f && g <= h || i == j * k / l - m + n';
            const description: GuardDescription = {
                expression: longExpression,
            };
            const guard = Guard.fromDescription(description);

            expect(guard).toBeInstanceOf(Guard);
            expect(guard.expression).toBe(longExpression);
        });
    });
});
