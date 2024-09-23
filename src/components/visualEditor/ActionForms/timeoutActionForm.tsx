import Action from "../../../classes/action.tsx";
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import RaiseEventActionForm from "./raiseEventActionForm.tsx";
import {ReactFlowContext} from "../../../utils.tsx";
import {isState, RaiseEventActionProps, ReactFlowContextProps, TimeoutActionProps} from "../../../types.ts";
import {ActionCategory, ActionType} from "../../../enums.ts";


export default function TimeoutActionForm(props: {action: Action | undefined,
    setActions: Dispatch<SetStateAction<Action[]>>,
    onSubmit?: () => void,
    noCategorySelect? :boolean,
    dontShowDeleteButton? :boolean, dontAddToState?: boolean}) {

    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {selectedNode, actionService, stateOrStateMachineService, eventService, selectedEdge} = context

    const oldName = props.action ? props.action.name : undefined
    const formID = "timeoutForm"


    const [actionNameInput, setActionNameInput] = useState<string>("");
    const [timeoutExpressionInput, setTimeoutExpressionInput] = useState<string>("");
    const [selectedActionCategory, setSelectedActionCategory] = useState<string>(ActionCategory.TIMEOUT)

    const [actionNameInputIsValid, setActionNameInputIsValid] = useState<boolean>(false);
    const [timeOutExpressionInputIsValid, setTimeOutExpressionInputIsValid] = useState<boolean>(false);
    const [raiseActionIsValid, setRaiseActionIsValid] = useState<boolean>(false);


    const [timeoutAction, setTimeoutAction] = useState<Action[]>([]);

    const headerText = () => props.action ? "Edit Timeout Action" : "Create Timeout Action";
    const submitButtonText = () => props.action ? "Update Timeout Action" : "Create Timeout Action";
    const invalidNameText = () => actionNameInput ? `Action with name ${actionNameInput} already exists` : "Name cant be empty"
    const invalidTimoutExpressionText  = () => timeoutExpressionInput ?  "Input must be a valid expression" : "Field cant be empty"











    const onActionNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setActionNameInput(event.currentTarget.value);
    }

    const onTimeoutExpressionInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTimeoutExpressionInput(event.currentTarget.value);
    }



    const validateActionNameInput = (name: string) => {
        if(!name.trim()){
            return false;
        }

        if(oldName === name){
            return true
        }

        return actionService.isNameUnique(name)


    }

    const validateTimeoutExpressionInput = (expression: string) => {
        //TODO: Validate expression logic
        return !!expression.trim()
    }

    const validateRaiseAction = (action: Action): boolean => {
        if(!action){
            return false;
        }
        const resA = action && action.type === ActionType.RAISE_EVENT
        const raiseEventProps = action.properties as RaiseEventActionProps;
        const resB = raiseEventProps.event && !!(raiseEventProps.event.name.trim()) && raiseEventProps.type === ActionType.RAISE_EVENT;
        return resA && resB
    }

    const onActionFormSubmit = () => {
        // TODO
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
        setActionNameInputIsValid(validateActionNameInput(actionNameInput));
        setTimeOutExpressionInputIsValid(validateTimeoutExpressionInput(timeoutExpressionInput));
        setRaiseActionIsValid(validateRaiseAction(timeoutAction[0]))

    }, [actionNameInput,timeoutExpressionInput,timeoutAction]);

    useEffect(() => {
        if(!selectedNode && !selectedEdge){
            return
        }
        if(props.action && props.action.type === ActionType.TIMEOUT){
            const timeoutActionProps = props.action.properties as TimeoutActionProps;
            console.log(timeoutActionProps.action.name)
            console.log(timeoutActionProps.action.properties as RaiseEventActionProps)
            setTimeoutAction([timeoutActionProps.action])
            setActionNameInput(timeoutActionProps.name)
            setTimeoutExpressionInput(timeoutActionProps.delay)

            if(selectedNode){
                const category = actionService.getActionCategory(props.action,selectedNode.data)
                if(category){
                    setSelectedActionCategory(category)
                }
            }

            console.log(!!timeoutAction)

        }
    }, []);


    const validateForm = () => {
        return actionNameInputIsValid && timeOutExpressionInputIsValid && raiseActionIsValid;
    }

    const onDeleteButtonPress = () => {

        if(!selectedNode && !selectedEdge){
            return;
        }

        if(!props.action || ! (props.action.type === ActionType.TIMEOUT)){
            return
        }

        const raiseEventProps = (props.action.properties as TimeoutActionProps).action.properties as RaiseEventActionProps;

        eventService.unregisterEvent(raiseEventProps.event.name)
        if(selectedNode){
            stateOrStateMachineService.removeActionFromState(props.action, selectedNode.data)
        }

        if(selectedEdge?.data){
            selectedEdge.data.transition.removeAction(props.action)
        }

        props.setActions((prevActions) => prevActions.filter((a) => a !== props.action))

    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if(!selectedNode && !selectedEdge){
            return
        }

        console.log("I was clicked!")

        const timeoutActionProps: TimeoutActionProps = {
            action: timeoutAction[0],
            delay:timeoutExpressionInput,
            name: actionNameInput,
            type: ActionType.TIMEOUT

        }


        let updatedAction: Action;


        if(selectedEdge){

            if(props.action){
                updatedAction = props.action;
                updatedAction.properties = timeoutActionProps;
                onActionSubmit(updatedAction);



                actionService.deregisterAction(updatedAction);
                actionService.registerAction(updatedAction);

                if(selectedEdge.data && !props.dontAddToState){
                    selectedEdge.data.transition.removeAction(updatedAction)
                    selectedEdge.data.transition.addAction(updatedAction)
                }

                if (props.onSubmit) {
                    props.onSubmit();
                }
                return
            }
            else {
                updatedAction = new Action(timeoutActionProps.name, ActionType.TIMEOUT);
                updatedAction.properties = timeoutActionProps;
                onActionSubmit(updatedAction);

                if(selectedEdge.data && !props.dontAddToState){
                    selectedEdge.data.transition.addAction(updatedAction)
                }

                actionService.registerAction(updatedAction);

                if (props.onSubmit) {
                    props.onSubmit();
                }
            }
            return

        }


        if(selectedNode) {

            // Handle updating an existing action
            if (props.action) {

                const oldCategory = actionService.getActionCategory(props.action, selectedNode.data);

                // Check if category has changed and update the action in the state node if needed
                if (oldCategory !== selectedActionCategory as ActionCategory && !props.dontAddToState) {
                    stateOrStateMachineService.removeActionFromState(props.action, selectedNode.data);
                    stateOrStateMachineService.addActionToState(selectedNode.data, props.action, selectedActionCategory as ActionCategory);
                }

                updatedAction = props.action;
                updatedAction.properties = timeoutActionProps;
                onActionSubmit(updatedAction);
            } else {
                updatedAction = new Action(timeoutActionProps.name, ActionType.TIMEOUT);
                updatedAction.properties = timeoutActionProps;
                if(!props.dontAddToState){
                    stateOrStateMachineService.addActionToState(selectedNode.data, updatedAction, selectedActionCategory as ActionCategory);
                }
                onActionSubmit(updatedAction);
            }

            if (props.onSubmit) {
                props.onSubmit();
            }

            actionService.deregisterAction(updatedAction);
            actionService.registerAction(updatedAction);


            if (isState(selectedNode.data)) {
                const sm = selectedNode.data
                sm.state.entry.forEach(entry => {
                    console.log(entry.properties)
                })
            }
        }



    }


    return(
       <Card>
           <Card.Header>
               {headerText()}
           </Card.Header>
           <Card.Body>
               <Card.Title className={"text-center"}>Action Properties</Card.Title>
               <Form validated={validateForm()} id={formID} onSubmit={onSubmit}>
                  <Form.Group as={Row} className={"mb-3"}>
                      <Form.Label column sm={"4"}>
                          Action Name:
                      </Form.Label>
                      <Col sm={8}>
                          <Form.Control type={"text"}
                                        placeholder={"Enter Action Name"}
                                        value={actionNameInput}
                                        onChange={onActionNameInputChange}
                                        isValid={actionNameInputIsValid}
                                        isInvalid={!actionNameInputIsValid}
                          />
                          <Form.Control.Feedback type={"invalid"}>
                              {invalidNameText()}
                          </Form.Control.Feedback>
                      </Col>
                  </Form.Group>

                   <Form.Group as={Row} className={"mb-3"}>
                       <Form.Label column sm={"4"}>
                           Delay:
                       </Form.Label>
                       <Col sm={8}>
                           <Form.Control type={"text"}
                                         placeholder={"Enter Delay"}
                                         value={timeoutExpressionInput}
                                         onChange={onTimeoutExpressionInputChange}
                                         isValid={timeOutExpressionInputIsValid}
                                         isInvalid={!timeOutExpressionInputIsValid}
                           />
                           <Form.Control.Feedback type={"invalid"}>
                               {invalidTimoutExpressionText()}
                           </Form.Control.Feedback>
                       </Col>
                   </Form.Group>

               </Form>
               {/* Conditionally render empty or full RaiseEventActionForm */}
               {timeoutAction[0] ? (
                   <RaiseEventActionForm
                       setActions={setTimeoutAction}
                       action={timeoutAction[0]}
                       onSubmit={onActionFormSubmit}
                       singleAction={true}
                       dontAddToEdge={true}
                       noCategorySelect={true}
                   />
               ) : (
                   <RaiseEventActionForm
                       setActions={setTimeoutAction}
                       action={undefined}
                       onSubmit={onActionFormSubmit}
                       singleAction={true}
                       dontAddToEdge={true}
                       noCategorySelect={true}
                   />
               )}
               {props.action && !props.dontShowDeleteButton && (
                   <Row className={"mb-3"}>
                       <Col sm={6}>
                           <Button type={"submit"}>{submitButtonText()}</Button>
                       </Col>
                       <Col sm={6}>
                           <Button variant={"danger"} onClick={onDeleteButtonPress}>Delete</Button>
                       </Col>
                   </Row>
               ) || (
                   <Button disabled={!validateForm()} form={formID} type={"submit"} className={"mt-3"}>
                       {submitButtonText()}
                   </Button>
               )}
           </Card.Body>
       </Card>
    )
}