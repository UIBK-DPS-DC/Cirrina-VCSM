import Action from "../../../classes/action.ts";
import {Button, Card, Container, Form, Row} from "react-bootstrap";
import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {ReactFlowContext, renderEnumAsOptions} from "../../../utils.tsx";
import {
    isState,
    RaiseEventActionProps,
    ReactFlowContextProps,
    TimeoutActionProps,
    TimeoutResetActionProps
} from "../../../types.ts";
import {ActionCategory, ActionType} from "../../../enums.ts";

export default function TimeoutResetActionForm(props: {action: Action | undefined,
    setActions: Dispatch<SetStateAction<Action[]>>,
    onSubmit?: () => void}) {

    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {selectedNode,
        actionService,
        stateOrStateMachineService} = context

    const headerText = () => props.action ? "Edit Timeout Reset Action" : "Create Timeout Reset Action";
    const submitButtonText = () => props.action ? "Update Timeout Reset Action" : "Create"
    const invalidSelectedActionText = () => "A valid actions needs to be selected"

    const optionText = (action: Action) => {
        const timeoutActionsProps = action.properties as TimeoutActionProps;
        const raiseEventProps = timeoutActionsProps.action.properties as RaiseEventActionProps
        return `Name: ${action.name} Event: ${raiseEventProps.event.name} Delay: ${timeoutActionsProps.delay}`;
    }
    const [selectedAction, setSelectedAction] = useState<string>("");
    const [selectedActionCategory, setSelectedActionCategory] = useState<string>(ActionCategory.ENTRY_ACTION)

    const [selectedActionsIsValid, setSelectedActionIsValid] = useState<boolean>(false);


    const validateSelectedAction = (action: string) => !!action.trim()

    const onSelectedActionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAction(event.currentTarget.value);
    }

    const onSelectedActionCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedActionCategory(event.target.value);
    }

    const renderTimeoutActionAsOptions = () => {
        return actionService.getActionsByType(ActionType.TIMEOUT).map((action: Action) => {
            return (
                <option key={action.name} value={action.name}>{optionText(action)}</option>
            )
        })
    }



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


    useEffect(() => {
        setSelectedActionIsValid(validateSelectedAction(selectedAction));
    }, [selectedAction]);

    useEffect(() => {
        if(!selectedNode){
            return
        }

        if(props.action && props.action.type === ActionType.TIMEOUT_RESET){
            setSelectedAction(props.action.name)

            const category = actionService.getActionCategory(props.action, selectedNode.data)
            if(category){
                setSelectedActionCategory(category)
            }
        }

    }, [props.action]);

    useEffect(() => {
        if (!selectedNode) {
            return;
        }

        const timeoutActions = actionService.getActionsByType(ActionType.TIMEOUT);

        // If there are timeout actions and the selected action is not set, initialize it to the first option.
        if (timeoutActions.length > 0 && !selectedAction) {
            setSelectedAction(timeoutActions[0].name);
        }

        if (props.action && props.action.type === ActionType.TIMEOUT_RESET) {
            setSelectedAction(props.action.name);

            const category = actionService.getActionCategory(props.action, selectedNode.data);
            if (category) {
                setSelectedActionCategory(category);
            }
        }
    }, [props.action, selectedNode, selectedAction, actionService]);


    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        event.stopPropagation()
        if(!selectedNode){
            return
        }

        const action = actionService.getActionByName(selectedAction)
        console.log(!!action)
        if(!action){
            console.log("No action found")
            return
        }

        const timeoutResetActionsProps: TimeoutResetActionProps = {
            action: action,
            type: ActionType.TIMEOUT_RESET

        }

        let updatedAction: Action;

        // Handle updating an existing action
        if (props.action) {

            const oldCategory = actionService.getActionCategory(props.action, selectedNode.data);

            // Check if category has changed and update the action in the state node if needed
            if (oldCategory !== selectedActionCategory as ActionCategory) {
                stateOrStateMachineService.removeActionFromState(props.action, selectedNode.data);
                stateOrStateMachineService.addActionToState(selectedNode.data, props.action, selectedActionCategory as ActionCategory);
            }

            updatedAction = props.action;
            updatedAction.properties = timeoutResetActionsProps;
            onActionSubmit(updatedAction);
        } else {
            updatedAction = new Action("", ActionType.TIMEOUT_RESET);
            updatedAction.properties = timeoutResetActionsProps;
            stateOrStateMachineService.addActionToState(selectedNode.data, updatedAction, selectedActionCategory as ActionCategory);
            onActionSubmit(updatedAction);
        }

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
       <Card>
           <Card.Header>
               {headerText()}
           </Card.Header>
           <Card.Body>
               <Card.Title className={"text-center"}>Action Properties</Card.Title>
               <Form onSubmit={onSubmit}>
                   <Form.Group as={Row} className={"mb-3"}>
                       {actionService.getActionsByType(ActionType.TIMEOUT).length > 0 && (
                           <Container>
                               <Form.Label column sm={"6"} className={"text-center"}>Timeout Action to reset</Form.Label>
                               <Form.Select value={selectedAction}
                                            onChange={onSelectedActionChange}
                                            isValid={selectedActionsIsValid}
                                            isInvalid={!selectedActionsIsValid}>
                                   {renderTimeoutActionAsOptions()}
                               </Form.Select>
                               <Form.Control.Feedback type={"invalid"}>
                                   {invalidSelectedActionText()}
                               </Form.Control.Feedback>

                               <Form.Group className={"mb-3"}>
                                   <Form.Label>Action Category</Form.Label>
                                   <Form.Select onChange={onSelectedActionCategoryChange}
                                                value={selectedActionCategory}
                                                className={"mb-3"}
                                                isValid={true}
                                   >
                                       {renderEnumAsOptions(ActionCategory)}
                                   </Form.Select>

                               </Form.Group>

                               <Button type={"submit"} disabled={!selectedActionsIsValid}>
                                   {submitButtonText()}
                               </Button>
                           </Container>
                       ) || (
                           <h4 className={"text-danger"}>No Timeout Actions found</h4>
                       )}
                   </Form.Group>
               </Form>
           </Card.Body>
       </Card>
    )
}