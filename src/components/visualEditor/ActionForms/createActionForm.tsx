import Action from "../../../classes/action.ts";
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import CreateContextFormModal from "../../Context/createContextFormModal.tsx";
import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import ContextVariable from "../../../classes/contextVariable.tsx";
import ContextCard from "../../Context/contextCard.tsx";
import {ReactFlowContext, renderEnumAsOptions} from "../../../utils.tsx";
import {CreateActionProps, isState, ReactFlowContextProps} from "../../../types.ts";
import {ActionCategory, ActionType} from "../../../enums.ts";

export default function CreateActionForm(props: {action: Action | undefined,
    setActions: Dispatch<SetStateAction<Action[]>>, onSubmit?: () => void, noCategorySelect? :boolean}) {

    const context = useContext(ReactFlowContext) as ReactFlowContextProps
    const {selectedNode,
    actionService,
    stateOrStateMachineService,
    contextService} = context

    const cardHeaderText = () => props.action ? "Edit Create Action" : "New Create Action"
    const submitButtonText = () => props.action ? "Update Action" : "Create Action"


    const [variableToBeCreated, setVariableToBeCreated] = useState<ContextVariable[]>([]);
    const [variableIsPersistent, setVariableIsPersistent] = useState<boolean>(false);
    const [formIsValid,setFormIsValid] = useState<boolean>(false);
    const [selectedActionCategory, setSelectedActionCategory] = useState<string>(ActionCategory.ENTRY_ACTION)

    const oldVariableName = props.action && props.action.type === ActionType.CREATE ? (props.action.properties as CreateActionProps).variable.name : undefined


    const onActionSubmit = (newAction: Action) => {
        props.setActions((prevActions) => {
            const existingAction = prevActions.find((a) => a === newAction);

            if (existingAction) {
                // Update the properties of the existing variable (maintain reference)
                existingAction.properties = newAction.properties
                existingAction.type = newAction.type
                existingAction.context = newAction.context
                return [...prevActions];
            } else {
                // Add the new variable if it doesn't exist
                return [...prevActions, newAction];
            }
        });
    }

    const onVariableIsPersistentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVariableIsPersistent(event.currentTarget.checked);
    }

    const onSelectedActionCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedActionCategory(event.target.value);
    }

    const onVariableCreate = (variable: ContextVariable): void => {
        setVariableToBeCreated([variable]);
    }

    const validateForm = () => {
        setFormIsValid(variableToBeCreated.length === 1);
    }

    useEffect(() => {
        console.log("YOU ARE HERE")
        console.log(props.action)
        if(!selectedNode){
            return
        }
        if(props.action && props.action.type === ActionType.CREATE){
            console.log("NO YOU ARE HEERERER")
            const createActionProps = props.action.properties as CreateActionProps
            setVariableToBeCreated([createActionProps.variable])
            setVariableIsPersistent(createActionProps.isPersistent)
            const actionCategory = actionService.getActionCategory(props.action,selectedNode.data)
            if(actionCategory) {
                setSelectedActionCategory(actionCategory)
            }
        }
    }, [props.action]);

    useEffect(() => {
        validateForm();
    }, [variableToBeCreated]);

    useEffect(() => {
        console.log(`Creating ${variableToBeCreated.toString()}`);
    }, [variableToBeCreated, setVariableToBeCreated]);


    const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        event.stopPropagation()

        if(!selectedNode){
            return;
        }

        if(variableToBeCreated.length !== 1){
            return;
        }


        const createActionProps: CreateActionProps = {
            isPersistent: variableIsPersistent,
            type: ActionType.CREATE,
            variable: variableToBeCreated[0]

        }



        let updatedAction: Action;

        if (props.action && props.action.type === ActionType.CREATE) {
            // If an existing action is provided (props.action), we are editing an existing action.
            const oldCategory = actionService.getActionCategory(props.action, selectedNode.data);

            // Check if the action category has changed. If so, we must update the action's category in the state or state machine.
            if (oldCategory !== selectedActionCategory as ActionCategory) {
                // Remove the action from its old category in the state or state machine.
                stateOrStateMachineService.removeActionFromState(props.action, selectedNode.data);

                // Add the action to its new category in the state or state machine.
                stateOrStateMachineService.addActionToState(selectedNode.data, props.action, selectedActionCategory as ActionCategory);
            }

            // Update the existing action's properties with the newly created action properties.
            updatedAction = props.action;
            updatedAction.properties = createActionProps;

            // Call the onActionSubmit function to update the action in the parent component's state.
            onActionSubmit(updatedAction);

            // Handle the case where the variable name has changed.
            if (oldVariableName && oldVariableName !== variableToBeCreated[0].name) {
                // If the old variable name exists and the new variable name is different, handle renaming logic.

                // Check if the context with the old name is the same object as the newly created variable.
                if (contextService.getContextByName(oldVariableName) === variableToBeCreated[0]) {
                    // Rename the context if the names don't match and the context is the same.
                    const newName = variableToBeCreated[0].name;
                    variableToBeCreated[0].name = oldVariableName;  // Temporarily set back to the old name
                    contextService.renameContext(variableToBeCreated[0], newName);  // Perform the renaming
                } else {
                    // If the context is a new variable, register it as a new context and associate it with the state.
                    if (isState(selectedNode.data)) {
                        contextService.registerContext(variableToBeCreated[0]);  // Register the new context variable
                        contextService.setContextCreatedBy(variableToBeCreated[0], selectedNode.data.state);  // Set the state that created the context
                    }
                }
            }
        } else {
            // If no existing action is provided, create a new action.
            updatedAction = new Action("newAction", ActionType.CREATE);

            // Set the properties of the new action with the createActionProps defined earlier.
            updatedAction.properties = createActionProps;

            // Add the newly created action to the state or state machine.
            stateOrStateMachineService.addActionToState(selectedNode.data, updatedAction, selectedActionCategory as ActionCategory);

            // Call the onActionSubmit function to update the action in the parent component's state.
            onActionSubmit(updatedAction);

            // Register the new context variable and associate it with the state.
            if (isState(selectedNode.data)) {
                contextService.registerContext(variableToBeCreated[0]);  // Register the new context variable
                contextService.setContextCreatedBy(variableToBeCreated[0], selectedNode.data.state);  // Set the state that created the context
            }
        }

        // If there is a provided onSubmit callback, call it after the form has been submitted successfully.
        if (props.onSubmit) {
            props.onSubmit();
        }

        actionService.deregisterAction(updatedAction);
        actionService.registerAction(updatedAction);

        if(isState(selectedNode.data)){
            const sm = selectedNode.data
            sm.state.entry.forEach(entry => {
                console.log(entry.properties)
            })
        }






    }

    return(
        <Card className={"text-center"}>
            <Card.Header>
                {cardHeaderText()}
            </Card.Header>

            <Card.Body>
                <Card.Title>Action Properties</Card.Title>
                <Form validated={formIsValid} onSubmit={onFormSubmit}>
                    {variableToBeCreated.length < 1 && (
                        <Form.Group as={Row} className="mb-3" controlId={"formVariableNew"}>
                            <Form.Label column sm={"6"}>Variable  to be created:</Form.Label>
                            <Col sm={6}>
                                <CreateContextFormModal variable={variableToBeCreated[0]} buttonName={"Create"} onSubmit={onVariableCreate} noRegister={true}>
                                </CreateContextFormModal>
                            </Col>
                        </Form.Group>
                    )}

                    {variableToBeCreated.length > 0 && (
                        <Form.Group className={"mb-3"} controlId={"formVariable"}>
                            <Form.Label className={"mb-3"}>Variable to be created</Form.Label>
                            <ContextCard contextVariable={variableToBeCreated[0]} setVars={setVariableToBeCreated} noRegister={true} noRemove={true}/>
                        </Form.Group>
                    )}

                    <Form.Group className={"mb-3 d-flex align-items-center"} controlId={"formIsPersistent"}>
                        <Form.Label className={"me-3 mb-0 ms-3"}>Is Persistent</Form.Label>
                        <Form.Check type={"checkbox"} checked={variableIsPersistent} onChange={onVariableIsPersistentChange}/>
                    </Form.Group>

                    {!props.noCategorySelect && (
                        <Form.Group className={"mb-3"}>
                            <Form.Label>Action Category</Form.Label>
                            <Form.Select onChange={onSelectedActionCategoryChange} value={selectedActionCategory} className={"mb-3"}>
                                {renderEnumAsOptions(ActionCategory)}
                            </Form.Select>
                        </Form.Group>
                    )}

                    {!formIsValid && (
                        <div className="text-danger mb-3">
                           Create Action needs to create a Variable
                        </div>
                    )}

                    <Button type={"submit"} disabled={!formIsValid}>{submitButtonText()}</Button>

                </Form>
            </Card.Body>
        </Card>
    )
}
