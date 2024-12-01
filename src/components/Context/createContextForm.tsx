import ContextVariable from "../../classes/contextVariable.tsx";
import React, {ChangeEvent, useCallback, useContext, useEffect, useState} from "react";
import {ReactFlowContext, renderEnumAsOptions, renderStringsAsOptions} from "../../utils.tsx";
import {isState, ReactFlowContextProps} from "../../types.ts";
import {Button, Form} from "react-bootstrap";
import {ContextType} from "../../enums.ts";

export default function CreateContextForm(props: {variable: ContextVariable | undefined,
    onClose: () => void,
    onSubmit: (updatedVariable: ContextVariable) => void,
    noRegister?:boolean,
    dontAddToState?: boolean,
    noTypeSelect? :boolean,
    csmVar?: boolean}) {

    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {contextService, selectedNode, darkMode} = context;

    const VARIABLE_NAME_FIELD_NAME = "variable-name";
    const EXPRESSION_FIELD_NAME = "expression";
    const CONTEXT_TYPE_FIELD_NAME = "contextType";

    const oldName = props.variable ? props.variable.name : null;
    const initialContextType = props.variable && contextService.getContextType(props.variable) ? contextService.getContextType(props.variable) : undefined;

    // States for managing input fields
    const [variableNameInput, setVariableNameInput] = useState<string>(props.variable ? props.variable.name : "");
    const [variableValueInput, setVariableValueInput] = useState<string>(props.variable ? props.variable.value : "");
    const [contextTypeValue, setContextTypeValue] = useState<string>(initialContextType ? initialContextType : ContextType.PERSISTENT);


    const [variableNameIsValid, setVariableNameIsValid] = useState<boolean>(!!props.variable?.name);
    const [expressionIsValid, setExpressionIsValid] = useState<boolean>(!!props.variable?.value);
    const [contextTypeIsValid, setContextTypeIsValid] = useState<boolean>(true);
    const [formIsValid, setFormIsValid] = useState<boolean>(variableNameIsValid && expressionIsValid && contextTypeIsValid);

    const buttonText = () => props.variable ? "Update Variable" : "Create Variable";
    const invalidNameText = () => variableNameInput ? `A variable with name "${variableNameInput}" already exists` : "Name cannot be empty";


    // Effect to sync form values with the props.variable when the modal is opened with a new variable
    useEffect(() => {
        if (props.variable) {
            setVariableNameInput(props.variable.name);
            setVariableValueInput(props.variable.value);
            setContextTypeValue(contextService.getContextType(props.variable) || "");
        }
    }, [props.variable, contextService]);

    useEffect(() => {
        setFormIsValid(variableNameIsValid && expressionIsValid && contextTypeIsValid);
    }, [variableNameIsValid, expressionIsValid, contextTypeIsValid]);

    const validateVariableName = useCallback((name: string) => {
        if (!name) {
            return false;
        }

        if (props.variable && name === oldName) {
            return true;
        }

        return contextService.isContextNameUnique(name);
    }, [props.variable, oldName, contextService]);

    const validateExpression = useCallback((e: string) => {
        // TODO: Logic to validate expression.
        return !!e;
    }, []);

    const validateContextType = useCallback((contextType: string) => {
        return Object.values(ContextType).includes(contextType as ContextType);
    }, []);

    const onVariableNameInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setVariableNameInput(value);
        setVariableNameIsValid(validateVariableName(value));
        setFormIsValid(variableNameIsValid && expressionIsValid && contextTypeIsValid);
    }, [validateVariableName, variableNameIsValid, expressionIsValid, contextTypeIsValid]);

    const onVariableValueInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setVariableValueInput(value);
        setExpressionIsValid(validateExpression(value));
        setFormIsValid(variableNameIsValid && expressionIsValid && contextTypeIsValid);
    }, [validateExpression, variableNameIsValid, expressionIsValid, contextTypeIsValid]);

    const onContextTypeValueChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setContextTypeValue(value);
        setContextTypeIsValid(validateContextType(value));
        setFormIsValid(variableNameIsValid && expressionIsValid && contextTypeIsValid);
    }, [validateContextType, variableNameIsValid, expressionIsValid, contextTypeIsValid]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation()


        const variableName = variableNameInput;
        const expression = variableValueInput;
        const contextType = contextTypeValue;
        let updatedVariable: ContextVariable;

        if (props.variable) {


            if(!props.noRegister && selectedNode){
                contextService.removeContext(props.variable, selectedNode.data);
                contextService.addContext(props.variable, selectedNode.data, contextType as ContextType);
            }

            props.variable.value = expression;

            if (oldName && oldName !== variableName && ! props.noRegister) {
                contextService.renameContext(props.variable, variableName);
            }

            if(props.noRegister){
                props.variable.name = variableName;
            }

            updatedVariable = props.variable


        } else {
            const newContext = new ContextVariable(variableName, expression);
            if(!props.noRegister && props.csmVar){
                contextService.registerContext(newContext)
            }
            if(!props.noRegister && selectedNode) {
                contextService.registerContext(newContext);
                if(!props.dontAddToState){
                    contextService.addContext(newContext, selectedNode.data, contextType as ContextType);
                    contextService.linkContextToStateByData(newContext, selectedNode.data);
                }
            }
            updatedVariable = newContext;
            console.log("New Context added!");
        }

        // Notify parent about the updated context variable
        props.onSubmit(updatedVariable);

        // Close form
        props.onClose();
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId={"form-variable-name"} className={"mb-3"}>
                <Form.Label style={{color: darkMode ? "#ffffff" : "#000000"}}>Name</Form.Label>
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

            <Form.Group controlId={"form-variable-value"} className={"mb-3"}>
                <Form.Label style={{color: darkMode ? "#ffffff" : "#000000"}}>Value</Form.Label>
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
                    The variable's value.
                </Form.Text>
            </Form.Group>

            {!props.noTypeSelect && (
                <Form.Group controlId={"form-variable-context"} className={"mb-3"}>
                    <Form.Label style={{color: darkMode ? "#ffffff" : "#000000"}}>Context Type</Form.Label>
                    <Form.Select
                        name={CONTEXT_TYPE_FIELD_NAME}
                        value={contextTypeValue}
                        onChange={onContextTypeValueChange}
                        isValid={contextTypeIsValid}
                        isInvalid={!contextTypeIsValid}
                    >
                        {selectedNode && isState(selectedNode.data) ? renderEnumAsOptions(ContextType)
                            : renderStringsAsOptions([ContextType.PERSISTENT,ContextType.LOCAL])}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Please select a valid context type.
                    </Form.Control.Feedback>
                    <Form.Text className={"text-muted"}>
                        The Context Type of the variable affects its visibility.
                    </Form.Text>
                </Form.Group>
            )}

            <Button variant="primary" type="submit" disabled={!formIsValid}>
                {buttonText()}
            </Button>
        </Form>
    );
}
