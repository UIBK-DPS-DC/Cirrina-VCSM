import Action from "../../../classes/action.tsx";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import React, {Dispatch, SetStateAction, useCallback, useContext, useEffect, useState} from "react";
import {ReactFlowContext, renderEnumAsOptions} from "../../../utils.tsx";
import {
    RaiseEventActionProps,
    ReactFlowContextProps,
    TimeoutActionProps,
    TimeoutResetActionProps
} from "../../../types.ts";
import {ActionCategory, ActionType} from "../../../enums.ts";

export default function TimeoutResetActionForm(props: {action: Action | undefined,
    setActions: Dispatch<SetStateAction<Action[]>>,
    onSubmit?: () => void,
    noCategorySelect?: boolean,
    dontShowDeleteButton? :boolean, dontAddToState?: boolean}) {

    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {selectedNode, actionService, stateOrStateMachineService, selectedEdge} = context;

    const [actionNameInput, setActionNameInput] = useState<string>("");
    const [selectedAction, setSelectedAction] = useState<string>("");
    const [selectedActionCategory, setSelectedActionCategory] = useState<string>(ActionCategory.ENTRY_ACTION);
    const [selectedActionsIsValid, setSelectedActionIsValid] = useState<boolean>(true);

    const headerText = () => props.action ? "Edit Timeout Reset Action" : "Create Timeout Reset Action";
    const submitButtonText = () => props.action ? "Update Timeout Reset Action" : "Create";
    const invalidSelectedActionText = () => "A valid action needs to be selected";

    const optionText = (action: Action) => {
        const timeoutActionsProps = action.properties as TimeoutActionProps;
        const raiseEventProps = timeoutActionsProps.action.properties as RaiseEventActionProps;
        return `Name: ${action.name} Event: ${raiseEventProps.event.name} Delay: ${timeoutActionsProps.delay}`;
    };

    // Get all timeout actions
    const renderTimeoutActionAsOptions = useCallback(() => {
        return actionService.getActionsByType(ActionType.TIMEOUT).map((action: Action) => (
            <option key={action.name} value={action.name}>{optionText(action)}</option>
        ));
    },[actionService, selectedNode, selectedAction])

    // Validate that the selected action exists in the available timeout actions
    const validateSelectedAction = (action: string) => {
        console.log(action)
        const availableActions = actionService.getActionsByType(ActionType.TIMEOUT);
        console.log(availableActions)
        return !! selectedAction || !! props.action//availableActions.some((timeoutAction: Action) => timeoutAction.name === action) || !!props.action;
    };

    const onActionNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setActionNameInput(event.target.value)
    }

    const onSelectedActionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAction(event.currentTarget.value);
    };

    const onSelectedActionCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedActionCategory(event.target.value);
    };

    const onActionSubmit = (newAction: Action) => {
        props.setActions((prevActions) => {
            const existingAction = prevActions.find((a) => a === newAction);
            if (existingAction) {
                existingAction.properties = newAction.properties;
                existingAction.type = newAction.type;
                existingAction.context = newAction.context;
                return [...prevActions];
            } else {
                return [...prevActions, newAction];
            }
        });
    };

    useEffect(() => {
        if (props.action) {
            const timeoutResetActionProps = props.action.properties as TimeoutResetActionProps;
            setActionNameInput(props.action.name)
            setSelectedAction(timeoutResetActionProps.action.name);
            setSelectedActionIsValid(validateSelectedAction(timeoutResetActionProps.action.name));
        }
    }, []);

    useEffect(() => {
        const timeoutActions = actionService.getActionsByType(ActionType.TIMEOUT);
        if(timeoutActions.length > 0){
            setSelectedAction(timeoutActions[0].name)
        }
    }, [actionService]);

    useEffect(() => {
        if(!selectedNode && !selectedEdge){
            return
        }
        if (props.action && props.action.type === ActionType.TIMEOUT_RESET) {
            const timeoutResetActionProps = props.action.properties as TimeoutResetActionProps;
            setSelectedAction(timeoutResetActionProps.action.name);
            if(selectedNode){
                const category = actionService.getActionCategory(props.action, selectedNode?.data);
                if (category) {
                    setSelectedActionCategory(category);
                }
            }
            setSelectedActionIsValid(validateSelectedAction(timeoutResetActionProps.action.name));
        }
    }, [props.action, selectedNode, selectedAction, actionService, renderTimeoutActionAsOptions]);


    useEffect(() => {
        setSelectedActionIsValid(validateSelectedAction(selectedAction));
    }, [selectedAction, renderTimeoutActionAsOptions]);

    const onDeleteButtonPress = () => {
        if ((!selectedNode && !selectedEdge) || !props.action) return;

        if(selectedNode){
            stateOrStateMachineService.removeActionFromState(props.action, selectedNode.data);
        }

        if(selectedEdge?.data){
            selectedEdge.data.transition.removeAction(props.action)
        }

        props.setActions((prevActions) => prevActions.filter((a) => a !== props.action));
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (!selectedNode && !selectedEdge) {
            return;
        }

        const action = actionService.getActionByName(selectedAction);
        if (!action) return;

        const timeoutResetActionsProps: TimeoutResetActionProps = {
            action: action,
            type: ActionType.TIMEOUT_RESET
        };

        let updatedAction: Action;

        if(selectedEdge){

            if(props.action){
                updatedAction = props.action;
                updatedAction.name = actionNameInput
                updatedAction.properties = timeoutResetActionsProps;
                onActionSubmit(updatedAction);

                actionService.deregisterAction(updatedAction);
                actionService.registerAction(updatedAction);

                if(selectedEdge.data){
                    selectedEdge.data.transition.removeAction(updatedAction)
                    selectedEdge.data.transition.addAction(updatedAction)
                }

                if (props.onSubmit) {
                    props.onSubmit();
                }
                return
            }
            else {
                updatedAction = new Action(actionNameInput, ActionType.TIMEOUT_RESET);
                updatedAction.properties = timeoutResetActionsProps;

                onActionSubmit(updatedAction);

                if (selectedEdge.data && !props.dontAddToState) {
                    selectedEdge.data.transition.addAction(updatedAction)
                }

                actionService.deregisterAction(updatedAction);
                actionService.registerAction(updatedAction);

                if(props.onSubmit){
                    props.onSubmit()
                }

                return
            }

        }

        if(selectedNode) {


            if (props.action) {
                const oldCategory = actionService.getActionCategory(props.action, selectedNode.data);
                if (oldCategory !== selectedActionCategory as ActionCategory && !props.dontAddToState) {
                    stateOrStateMachineService.removeActionFromState(props.action, selectedNode.data);
                    stateOrStateMachineService.addActionToState(selectedNode.data, props.action, selectedActionCategory as ActionCategory);
                }
                updatedAction = props.action;
                updatedAction.name = actionNameInput
                updatedAction.properties = timeoutResetActionsProps;
                onActionSubmit(updatedAction);
            } else {
                updatedAction = new Action(actionNameInput, ActionType.TIMEOUT_RESET);
                updatedAction.properties = timeoutResetActionsProps;
                if (!props.dontAddToState) {
                    stateOrStateMachineService.addActionToState(selectedNode.data, updatedAction, selectedActionCategory as ActionCategory);
                }
                onActionSubmit(updatedAction);
            }

            if (props.onSubmit) {
                props.onSubmit();
            }

            actionService.deregisterAction(updatedAction);
            actionService.registerAction(updatedAction);
        }
    };

    return (
        <Card>
            <Card.Header>{headerText()}</Card.Header>
            <Card.Body>
                <Card.Title className={"text-center"}>Action Properties</Card.Title>
                <Form onSubmit={onSubmit}>
                    <Form.Group as={Row} className={"mb-3"}>
                        <Form.Label column sm="3">
                            Action Name:
                        </Form.Label>
                        <Col sm={"9"}>
                            <Form.Control type={"text"} value={actionNameInput} onChange={onActionNameInputChange}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className={"mb-3"}>
                        {actionService.getActionsByType(ActionType.TIMEOUT).length > 0 ? (
                            <Container>
                                <Form.Label column sm={"6"} className={"text-center"}>Timeout Action to reset</Form.Label>
                                <Form.Select
                                    value={selectedAction}
                                    onChange={onSelectedActionChange}
                                    isValid={(!!props.action || selectedActionsIsValid)}
                                    isInvalid={!selectedActionsIsValid}
                                >
                                    {renderTimeoutActionAsOptions()}
                                </Form.Select>
                                <Form.Control.Feedback type={"invalid"}>
                                    {invalidSelectedActionText()}
                                </Form.Control.Feedback>

                                {!props.noCategorySelect && (
                                    <Form.Group className={"mb-3"}>
                                        <Form.Label>Action Category</Form.Label>
                                        <Form.Select
                                            onChange={onSelectedActionCategoryChange}
                                            value={selectedActionCategory}
                                            className={"mb-3"}
                                            isValid={true}
                                        >
                                            {renderEnumAsOptions(ActionCategory)}
                                        </Form.Select>
                                    </Form.Group>
                                )}

                                {(props.action && !props.dontShowDeleteButton) ? (
                                    <Row className={"mb-3"}>
                                        <Col sm={6}>
                                            <Button type={"submit"}>{submitButtonText()}</Button>
                                        </Col>
                                        <Col sm={6}>
                                            <Button variant={"danger"} onClick={onDeleteButtonPress}>Delete</Button>
                                        </Col>
                                    </Row>
                                ) : (
                                    <Button type={"submit"} disabled={!selectedActionsIsValid}>{submitButtonText()}</Button>
                                )}
                            </Container>
                        ) : (
                            <h4 className={"text-danger"}>No Timeout Actions found</h4>
                        )}
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>
    );
}
