import Action from "../../../classes/action.ts";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import SelectEventsModal from "../../Event/selectEventsModal.tsx";
import Event from "../../../classes/event.ts";
import CreateEventModal from "../../Event/createEventModal.tsx";
import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {ActionCategory, ActionType} from "../../../enums.ts";
import {ReactFlowContext, renderEnumAsOptions} from "../../../utils.tsx";

import EventCard from "../../Event/eventCard.tsx";
import ContextVariable from "../../../classes/contextVariable.tsx";
import {isState, RaiseEventActionProps, ReactFlowContextProps} from "../../../types.ts";

export default function RaiseEventActionForm(props: {action: Action | undefined,
    setActions: Dispatch<SetStateAction<Action[]>>,
    onSubmit?: () => void}) {

    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {selectedNode,
    actionService, stateOrStateMachineService} = context

    const headerText = () => props.action ? "Edit Raise Event Action" : "Create Raise Event Action"
    const submitButtonText = () => props.action ? "Save Changes" : "Create"

    const [eventToBeRaised, setEventToBeRaised] = React.useState<Event[]>([]);
    const [selectedActionCategory, setSelectedActionCategory] = useState<string>(ActionCategory.ENTRY_ACTION)
    const [eventVars, setSelectedEventVars] = useState<ContextVariable[]>([]);
    const [formIsValid, setFormIsValid] = useState<boolean>(false);



    const validateForm = () => eventToBeRaised.length === 1




    const onEventSubmit =(newEvent: Event) => {
        setEventToBeRaised((prevEvents) => {
            const existingEvent = prevEvents.find((e) => e.name === newEvent.name)

            if(existingEvent) {
                existingEvent.name = newEvent.name;
                existingEvent.data = newEvent.data
                existingEvent.channel = newEvent.channel
                return[...prevEvents];
            }
            else{
                return [newEvent];
            }
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

    const onSelectedActionCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedActionCategory(event.target.value);
    }

    useEffect(() => {
        setFormIsValid(validateForm());
    }, [eventToBeRaised]);

    useEffect(() => {
        if(!selectedNode)
            return
        if(props.action && props.action.type === ActionType.RAISE_EVENT){
            const raiseEventProps = props.action.properties as RaiseEventActionProps
            setEventToBeRaised([raiseEventProps.event])
            const actionCategory = actionService.getActionCategory(props.action,selectedNode.data)
            setSelectedEventVars(raiseEventProps.event.data)
            if(actionCategory) {
                setSelectedActionCategory(actionCategory)
            }


        }
    }, []);

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        event.stopPropagation()

        if(!selectedNode){
            return
        }

        const raiseEventActionProps: RaiseEventActionProps = {
            event: eventToBeRaised[0],
            type: ActionType.RAISE_EVENT

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
            updatedAction.properties = raiseEventActionProps;
            onActionSubmit(updatedAction);
        } else {
            updatedAction = new Action("newAction", ActionType.RAISE_EVENT);
            updatedAction.properties = raiseEventActionProps;
            stateOrStateMachineService.addActionToState(selectedNode.data, updatedAction, selectedActionCategory as ActionCategory);
            onActionSubmit(updatedAction);
        }

        if (props.onSubmit) {
            props.onSubmit();
        }

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
                <Card.Title>
                    Action Properties
                </Card.Title>

                <Form onSubmit={onSubmit} validated={formIsValid}>
                    {(!props.action || (props.action && eventToBeRaised.length < 1)) && (
                        <Container>
                            <Form.Group as={Row} controlId={"formSelectEvent"} className={"mb-3"}>
                                <Form.Label column sm={"4"}>
                                    Event Raised
                                </Form.Label>
                                <Col sm={4}>
                                    <SelectEventsModal buttonName={"Select"} modalTitle={"Select Event"} events={eventToBeRaised} setEvents={setEventToBeRaised}/>
                                </Col>
                                <Col sm={4}>
                                    <CreateEventModal event={eventToBeRaised[0]} onSubmit={onEventSubmit} setVars={setSelectedEventVars}/>
                                </Col>
                            </Form.Group>
                            {eventToBeRaised.length > 0 && (
                                <EventCard event={eventToBeRaised[0]} setEvents={setEventToBeRaised} vars={eventVars} setVars={setSelectedEventVars} noEdit={true}/>
                            )}
                        </Container>

                    ) || (
                        <EventCard event={eventToBeRaised[0]} setEvents={setEventToBeRaised} vars={eventVars} setVars={setSelectedEventVars}/>
                    )}


                    <Form.Group className={"mb-3"}>
                        <Form.Label>Action Category</Form.Label>
                        <Form.Select onChange={onSelectedActionCategoryChange} value={selectedActionCategory} className={"mb-3"}>
                            {renderEnumAsOptions(ActionCategory)}
                        </Form.Select>
                    </Form.Group>

                    <Button type={"submit"} disabled={!formIsValid}>
                        {submitButtonText()}
                    </Button>

                </Form>
            </Card.Body>
        </Card>
    )
}