import Action from "../../../classes/action.ts";
import Event from "../../../classes/event.ts";
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import {ActionCategory, ActionType, ServiceType} from "../../../enums.ts";
import {ReactFlowContext, renderEnumAsOptions} from "../../../utils.tsx";
import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import CreateContextFormModal from "../../Context/createContextFormModal.tsx";
import SelectContextsModal from "../../Context/selectContextsModal.tsx";
import ContextCardDisplay from "../../Context/contextCardDisplay.tsx";
import ContextVariable from "../../../classes/contextVariable.tsx";
import CreateEventModal from "../../Event/createEventModal.tsx";
import SelectEventsModal from "../../Event/selectEventsModal.tsx";
import EventCardDisplay from "../../Event/eventCardDisplay.tsx";
import {InvokeActionProps, isState, ReactFlowContextProps} from "../../../types.ts";



export default function InvokeActionForm(props: {action: Action | undefined,
    setActions: Dispatch<SetStateAction<Action[]>>,
    onSubmit?: () => void,
    noCategorySelect?: boolean,
    dontAddToState? :boolean,
    dontShowDeleteButton? :boolean }) {

    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {selectedNode,
    stateOrStateMachineService,
    actionService, selectedEdge} = context;


    const submitButtonText = () => props.action ? "Save Changes" : "Create Action"

    // Selected variables
    const [selectedInputContextVariables, setSelectedInputContextVariables] = useState<ContextVariable[]>([]);
    const [serviceIsLocalCheckbox, setServiceIsLocalCheckbox] = useState<boolean>(false);
    const [selectedOutputContextVariables, setSelectedOutputContextVariables] = useState<ContextVariable[]>([]);
    const [selectedEventsWhenDone, setSelectedEventsWhenDone] = useState<Event[]>([]);
    const [selectedServiceType, setSelectedServiceType] = useState<string>(ServiceType.LOCAL)
    const [selectedActionCategory, setSelectedActionCategory] = useState<string>(ActionCategory.ENTRY_ACTION)

    const [selectedEventVars, setSelectedEventVars] = useState<ContextVariable[]>([]);

    useEffect(() => {
        console.log(selectedServiceType)
    }, [selectedServiceType]);

    useEffect(() => {
        console.log(serviceIsLocalCheckbox)
    }, [serviceIsLocalCheckbox]);

    useEffect(() => {
        console.log(selectedActionCategory)
    }, [selectedActionCategory]);

    useEffect(() => {
        if(!selectedNode && !selectedEdge){
            return;
        }
        if(props.action && props.action.type === ActionType.INVOKE){
            const invokeActionProps = props.action.properties as InvokeActionProps;
            setSelectedInputContextVariables(invokeActionProps.input)
            setServiceIsLocalCheckbox(invokeActionProps.isLocal)
            setSelectedOutputContextVariables(invokeActionProps.output)
            setSelectedEventsWhenDone(invokeActionProps.done)
            setSelectedServiceType(invokeActionProps.serviceType)

            if(selectedNode){
                const actionCategory = actionService.getActionCategory(props.action,selectedNode.data)
                if(actionCategory) {
                    setSelectedActionCategory(actionCategory)
                }
            }

            const eventVars = invokeActionProps.done.map((e) => e.data).flat()
            setSelectedEventVars(eventVars)



        }
    }, []);

    const onServiceIsLocalCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setServiceIsLocalCheckbox(event.currentTarget.checked);
    }

    const onSelectedServiceTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedServiceType(event.target.value);
    }

    const onSelectedActionCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedActionCategory(event.target.value);
    }

    const onInputContextSubmit = (newVar: ContextVariable) => {
        setSelectedInputContextVariables((prevVars) => {
            const existingVar = prevVars.find((v) => v.name === newVar.name);

            if (existingVar) {
                // Update the properties of the existing variable (maintain reference)
                existingVar.name = newVar.name;
                existingVar.value = newVar.value;
                return [...prevVars];
            } else {
                // Add the new variable if it doesn't exist
                return [...prevVars, newVar];
            }
        });
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





    const onOutputContextSubmit = (newVar: ContextVariable) => {
        setSelectedOutputContextVariables((prevVars) => {
            const existingVar = prevVars.find((v) => v.name === newVar.name);

            if (existingVar) {
                // Update the properties of the existing variable (maintain reference)
                existingVar.name = newVar.name;
                existingVar.value = newVar.value;
                return [...prevVars];
            } else {
                // Add the new variable if it doesn't exist
                return [...prevVars, newVar];
            }
        });
    }

    const onEventSubmit =(newEvent: Event) => {
        setSelectedEventsWhenDone((prevEvents) => {
            const existingEvent = prevEvents.find((e) => e.name === newEvent.name)

            if(existingEvent) {
                existingEvent.name = newEvent.name;
                existingEvent.data = newEvent.data
                existingEvent.channel = newEvent.channel
                return[...prevEvents];
            }
            else{
                return [...prevEvents, newEvent];
            }
        })
    }

    const onDeleteButtonPress = () => {

        if(!selectedNode){
            return;
        }

        if(!props.action){
            return
        }

        stateOrStateMachineService.removeActionFromState(props.action, selectedNode.data)
        props.setActions((prevActions) => prevActions.filter((a) => a !== props.action))

    }

    const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (!selectedNode && !selectedEdge) {
            return;
        }

        const invokeActionsProperties: InvokeActionProps = {
            done: selectedEventsWhenDone,
            input: selectedInputContextVariables,
            isLocal: serviceIsLocalCheckbox,
            output: selectedOutputContextVariables,
            serviceType: selectedServiceType as ServiceType,
            type: ActionType.INVOKE,
        };

        let updatedAction: Action;



        if(selectedEdge){

            if(props.action){
                updatedAction = props.action;
                updatedAction.properties = invokeActionsProperties;
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
            }
            else {
                updatedAction = new Action("newAction", ActionType.INVOKE);
                updatedAction.properties = invokeActionsProperties;


                actionService.deregisterAction(updatedAction);
                actionService.registerAction(updatedAction);

                if(selectedEdge.data){
                    selectedEdge.data.transition.addAction(updatedAction)
                }

                onActionSubmit(updatedAction);
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
                if (oldCategory !== selectedActionCategory as ActionCategory) {
                    if (!props.dontAddToState) {
                        stateOrStateMachineService.removeActionFromState(props.action, selectedNode.data);
                        stateOrStateMachineService.addActionToState(selectedNode.data, props.action, selectedActionCategory as ActionCategory);
                    }
                }

                updatedAction = props.action;
                updatedAction.properties = invokeActionsProperties;
                onActionSubmit(updatedAction);
            } else {
                updatedAction = new Action("newAction", ActionType.INVOKE);
                updatedAction.properties = invokeActionsProperties;
                //TODO provide optional dont add action to state prop.
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


            if (isState(selectedNode.data)) {
                const sm = selectedNode.data
                sm.state.entry.forEach(entry => {
                    console.log(entry.properties)
                })
            }
        }
    };


    const cardHeaderText = () => props.action ? "Edit Invoke Action" : "Create new Invoke Action";

    return (
        <Card className={"text-center"}>
            <Card.Header>
                {cardHeaderText()}
            </Card.Header>
            <Card.Body>
                <Card.Title>Action Properties</Card.Title>
                <Form onSubmit={onFormSubmit}>
                    <Form.Group as={Row} className="mb-3" controlId="formServiceType">
                        <Form.Label column sm="3" className="text-sm-end">
                            ServiceType
                        </Form.Label>
                        <Col sm="9">
                            <Form.Select value={selectedServiceType} onChange={onSelectedServiceTypeChange}>
                                {renderEnumAsOptions(ServiceType)}
                            </Form.Select>
                            <Form.Text className={"text-muted"}>
                                The Actions Service Type
                            </Form.Text>
                        </Col>
                    </Form.Group>

                    <Form.Group className={"mb-3 d-flex align-items-center"} controlId={"formIsLocal"}>
                        <Form.Label className={"me-3 mb-0 ms-3"}>Service is local</Form.Label>
                        <Form.Check type="checkbox" checked={serviceIsLocalCheckbox} onChange={onServiceIsLocalCheckboxChange} />
                    </Form.Group>

                    <Form.Group as={Row} className={"mb-3"} controlId={"fromInputVariables"}>
                        <Form.Label column sm={3} className={"mb-0"}>Input</Form.Label>
                        <Col sm={5}>
                            <SelectContextsModal buttonName={"Select Variables"} vars={selectedInputContextVariables} setVars={setSelectedInputContextVariables} />
                        </Col>
                        <Col sm={4}>
                            <CreateContextFormModal variable={undefined} buttonName={"Create New"} onSubmit={onInputContextSubmit} />
                        </Col>
                    </Form.Group>

                    <Form.Group className={"mb-3"}>
                        <ContextCardDisplay vars={selectedInputContextVariables} headerText={"Selected Input Vars"} setVars={setSelectedInputContextVariables} />
                    </Form.Group>

                    <Form.Group as={Row} className={"mb-3"} controlId={"formDoneEvents"} >
                        <Form.Label column sm={3} className={"mb-0"}>Done Events</Form.Label>
                        <Col sm={5}>
                            <SelectEventsModal buttonName={"Select Events"} modalTitle={"Select Events to be raised when done"} events={selectedEventsWhenDone} setEvents={setSelectedEventsWhenDone}/>
                        </Col>
                        <Col sm={4}>
                            <CreateEventModal event={undefined} onSubmit={onEventSubmit} setVars={setSelectedEventVars}/>
                        </Col>
                    </Form.Group>

                    <Form.Group className={"mb-3"}>
                        <EventCardDisplay headerText={"Selected Events"} events={selectedEventsWhenDone} setEvents={setSelectedEventsWhenDone} setVars={setSelectedEventVars} vars={selectedEventVars} />
                    </Form.Group>

                    <Form.Group as={Row} className={"mb-3"} controlId={"fromOutputVariables"}>
                        <Form.Label column sm={3} className={"mb-0"}>Output</Form.Label>
                        <Col sm={5}>
                            <SelectContextsModal buttonName={"Select Variables"} vars={selectedOutputContextVariables} setVars={setSelectedOutputContextVariables} />
                        </Col>
                        <Col sm={4}>
                            <CreateContextFormModal variable={undefined} buttonName={"Create New"} onSubmit={onOutputContextSubmit} />
                        </Col>
                    </Form.Group>

                    <Form.Group className={"mb-3"}>
                        <ContextCardDisplay vars={selectedOutputContextVariables} headerText={"Selected Output Vars"} setVars={setSelectedOutputContextVariables} />
                    </Form.Group>

                    {!props.noCategorySelect && (
                        <Form.Group className={"mb-3"}>
                            <Form.Label>Action Category</Form.Label>
                            <Form.Select onChange={onSelectedActionCategoryChange} value={selectedActionCategory} className={"mb-3"}>
                                {renderEnumAsOptions(ActionCategory)}
                            </Form.Select>
                        </Form.Group>
                    )}


                    {props.action && !props.dontShowDeleteButton && (
                        <Row className={"mb-3"}>
                            <Col sm={6}>
                                <Button type={"submit"} >{submitButtonText()}</Button>
                            </Col>
                            <Col sm={6}>
                                <Button variant={"danger"} onClick={onDeleteButtonPress}>Delete</Button>
                            </Col>
                        </Row>
                    ) || (
                        <Button type={"submit"}>{submitButtonText()}</Button>
                    )}



                </Form>
            </Card.Body>
        </Card>
    );
}
