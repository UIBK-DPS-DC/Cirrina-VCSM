import ContextVariable from "../../classes/contextVariable.tsx";
import React, {ChangeEvent, useCallback, useContext, useEffect, useState} from "react";
import {ReactFlowContext, renderEnumAsOptions} from "../../utils.tsx";
import { ReactFlowContextProps} from "../../types.ts";
import {Button, Form} from "react-bootstrap";
import {ContextType} from "../../enums.ts";

export default function ContextForm(props: {variable: ContextVariable | undefined, onClose: () => void}) {



    const VARIABLE_NAME_FIELD_NAME = "variable-name";
    const EXPRESSION_FIELD_NAME = "expression";
    const CONTEXT_TYPE_FIELD_NAME = "contextType";

    const oldName = props.variable ? props.variable.name : null;


    const EXPRESSION_INFO_LINK = "https://en.wikipedia.org/wiki/Expression_(computer_science)";
    const SPECIFICATIONS_LINK = "https://github.com/UIBK-DPS-DC/Cirrina-Specifications/blob/develop/SPECIFICATIONS.md#data-model-manipulation-and-scope";

    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {contextService,
    selectedNode} = context;


    const [variableNameInput, setVariableNameInput] = useState<string>("");
    const [variableValueInput, setVariableValueInput] = useState<string>("");
    const [contextTypeValue, setContextTypeValue] = useState<string>("");

    const [formIsValid, setFormIsValid] = useState<boolean>(false);
    const [variableNameIsValid, setVariableNameIsValid] = useState<boolean>(false);
    const [expressionIsValid, setExpressionIsValid] = useState<boolean>(false);
    const [contextTypeIsValid, setContextTypeIsValid] = useState<boolean>(true);

    const buttonText = () => props.variable ? "Update Variable" : "Create Variable";
    const invalidNameText = () => variableNameInput? `A variable with name "${variableNameInput}" already exists` : "Name cannot be empty";


        useEffect(() => {
        setFormIsValid(variableNameIsValid && expressionIsValid && contextTypeIsValid);
    }, [variableNameIsValid, expressionIsValid, contextTypeIsValid]);


    const validateVariableName = useCallback((name: string) => {
        if(!name){
            return false;
        }
        if ((props.variable && props.variable.name !== name) || !props.variable) {
            return contextService.isContextNameUnique(name);
        }
        return true;
    }, [props.variable, contextService]);

    const validateExpression = useCallback((e: string) => {
        // TODO: Logic to validate expression.
        return !!e
    }, []);

    const validateContextType = useCallback((contextType: string) => {
        return Object.values(ContextType).includes(contextType as ContextType);
    }, []);

    const validateForm = useCallback(() => {
        return variableNameIsValid && expressionIsValid && contextTypeIsValid;
    }, [variableNameIsValid, expressionIsValid, contextTypeIsValid]);


    const onVariableNameInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setVariableNameInput(value);
        setVariableNameIsValid(validateVariableName(value));
        setFormIsValid(validateForm());
    }, [validateVariableName, validateForm]);

    const onVariableValueInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setVariableValueInput(value);
        setExpressionIsValid(validateExpression(value));
        setFormIsValid(validateForm());
    }, [validateExpression, validateForm]);

    const onContextTypeValueChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setContextTypeValue(value);
        setContextTypeIsValid(validateContextType(value));
        setFormIsValid(validateForm());
    }, [validateContextType, validateForm]);



    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!selectedNode?.data){
            return;
        }

        const formElements = event.currentTarget.elements as typeof event.currentTarget.elements & {
            [VARIABLE_NAME_FIELD_NAME]: HTMLInputElement;
            [EXPRESSION_FIELD_NAME]: HTMLInputElement;
            [CONTEXT_TYPE_FIELD_NAME]: HTMLSelectElement;
        };

        const variableName = formElements[VARIABLE_NAME_FIELD_NAME].value;
        const expression = formElements[EXPRESSION_FIELD_NAME].value;
        const contextType = formElements[CONTEXT_TYPE_FIELD_NAME].value;

        console.log(`VariableName: ${variableName}`);
        console.log(`Expression: ${expression}`);
        console.log(`ContextType: ${contextType}`);

        if(props.variable) {

            contextService.removeContext(props.variable,selectedNode.data)
            contextService.addContext(props.variable,selectedNode.data,contextType as ContextType);
            props.variable.name = variableName;
            props.variable.value = expression

            if(oldName && oldName !== variableName) {
                contextService.deregisterContextByName(oldName)
                contextService.registerContext(props.variable)
            }


        }
        else {
            const newContext = new ContextVariable(variableName, expression);
            contextService.registerContext(newContext)
            contextService.addContext(newContext,selectedNode.data,contextType as ContextType);
            console.log("New Context added!")
        }


        props.onClose();
    };




    return (
        <Form onSubmit={handleSubmit} className={"no"}>
            <Form.Group controlId={"form-variable-name"}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type={"text"}
                    name={VARIABLE_NAME_FIELD_NAME}
                    placeholder={"Variable Name"}
                    value={variableNameInput}
                    onChange={onVariableNameInputChange}
                    required
                    isValid={variableNameIsValid}
                    isInvalid={!variableNameIsValid}
                />
                <Form.Control.Feedback type="invalid">
                    {invalidNameText()}
                </Form.Control.Feedback>
                <Form.Text className={"text-muted"}>
                    The new Variable's Name
                </Form.Text>
            </Form.Group>

            <Form.Group controlId={"form-variable-value"}>
                <Form.Label>Value</Form.Label>
                <Form.Control
                    type={"text"}
                    name={EXPRESSION_FIELD_NAME}
                    placeholder={"Value"}
                    value={variableValueInput}
                    onChange={onVariableValueInputChange}
                    required
                    isValid={expressionIsValid}
                    isInvalid={!expressionIsValid}
                />
                <Form.Control.Feedback type="invalid">
                    Please provide a valid expression.
                </Form.Control.Feedback>
                <Form.Text className={"text-muted"}>
                    The variable's value. Must be an <a href={EXPRESSION_INFO_LINK} target={"_blank"}>Expression</a>.
                </Form.Text>
            </Form.Group>

            <Form.Group controlId={"form-variable-context"}>
                <Form.Label>Context Type</Form.Label>
                <Form.Select
                    name={CONTEXT_TYPE_FIELD_NAME}
                    value={contextTypeValue}
                    onChange={onContextTypeValueChange}
                    isValid={contextTypeIsValid}
                    isInvalid={!contextTypeIsValid}
                >
                    {renderEnumAsOptions(ContextType)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    Please select a valid context type.
                </Form.Control.Feedback>
                <Form.Text className={"text-muted"}>
                    The Context Type of the variable affects its visibility. See the <a href={SPECIFICATIONS_LINK} target={"_blank"}>Specification</a>.
                </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit" disabled={!formIsValid} className={!formIsValid ? 'disabled' : ''}>
                {buttonText()}
            </Button>
        </Form>

    );
}
