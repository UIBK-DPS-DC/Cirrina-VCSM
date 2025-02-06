import ContextVariable from "../src/classes/contextVariable";
import {ContextVariableDescription} from "../src/pkl/bindings/collaborative_state_machine_description.pkl";

describe('ContextVariable Class', () => {

    describe('toDescription Method', () => {

        it('should convert ContextVariable to ContextVariableDescription correctly', () => {
            const contextVariable = new ContextVariable('testName', 'testValue');
            const description = contextVariable.toDescription();

            expect(description).toEqual({
                name: 'testName',
                value: 'testValue'
            });
        });

        it('should handle empty name and value', () => {
            const contextVariable = new ContextVariable('', '');
            const description = contextVariable.toDescription();

            expect(description).toEqual({
                name: '',
                value: ''
            });
        });

        it('should handle special characters in name and value', () => {
            const contextVariable = new ContextVariable('name!@#$', 'value%^&*');
            const description = contextVariable.toDescription();

            expect(description).toEqual({
                name: 'name!@#$',
                value: 'value%^&*'
            });
        });

        it('should handle numeric values as strings', () => {
            const contextVariable = new ContextVariable('numName', '12345');
            const description = contextVariable.toDescription();

            expect(description).toEqual({
                name: 'numName',
                value: '12345'
            });
        });
    });

    describe('fromDescription Method', () => {

        it('should convert ContextVariableDescription to ContextVariable correctly', () => {
            const description: ContextVariableDescription = {
                name: 'testName',
                value: 'testValue'
            };
            const contextVariable = ContextVariable.fromDescription(description);

            expect(contextVariable).toBeInstanceOf(ContextVariable);
            expect(contextVariable.name).toBe('testName');
            expect(contextVariable.value).toBe('testValue');
        });

        it('should handle empty name and value in description', () => {
            const description: ContextVariableDescription = {
                name: '',
                value: ''
            };
            const contextVariable = ContextVariable.fromDescription(description);

            expect(contextVariable).toBeInstanceOf(ContextVariable);
            expect(contextVariable.name).toBe('');
            expect(contextVariable.value).toBe('');
        });

        it('should handle special characters in name and value in description', () => {
            const description: ContextVariableDescription = {
                name: 'name!@#$',
                value: 'value%^&*'
            };
            const contextVariable = ContextVariable.fromDescription(description);

            expect(contextVariable).toBeInstanceOf(ContextVariable);
            expect(contextVariable.name).toBe('name!@#$');
            expect(contextVariable.value).toBe('value%^&*');
        });

        it('should handle numeric values as strings in description', () => {
            const description: ContextVariableDescription = {
                name: 'numName',
                value: '12345'
            };
            const contextVariable = ContextVariable.fromDescription(description);

            expect(contextVariable).toBeInstanceOf(ContextVariable);
            expect(contextVariable.name).toBe('numName');
            expect(contextVariable.value).toBe('12345');
        });


        it('should handle long strings for name and value', () => {
            const longName = 'n'.repeat(1000);
            const longValue = 'v'.repeat(1000);
            const description: ContextVariableDescription = {
                name: longName,
                value: longValue
            };
            const contextVariable = ContextVariable.fromDescription(description);

            expect(contextVariable.name).toBe(longName);
            expect(contextVariable.value).toBe(longValue);
        });
    });
});
