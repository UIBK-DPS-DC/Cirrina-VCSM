import Event from "../../classes/event.ts";
import { Button, Col, Form, Row } from "react-bootstrap";
import React, {Dispatch, SetStateAction, useCallback, useContext, useEffect, useState} from "react";
import { ReactFlowContext, renderEnumAsOptions } from "../../utils.tsx";
import { ReactFlowContextProps } from "../../types.ts";
import { EventChannel } from "../../enums.ts";
import ContextVariable from "../../classes/contextVariable.tsx";
import SelectContextsModal from "../Context/selectContextsModal.tsx";
import CreateContextFormModal from "../Context/createContextFormModal.tsx";
import ContextCardDisplay from "../Context/contextCardDisplay.tsx";

export default function CreateEventForm(props: { event: Event | undefined, onSubmit: (event: Event) => void, setVars?:  Dispatch<SetStateAction<ContextVariable[]>> }) {

    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const { eventService, darkMode} = context;

    const oldEventName = props.event?.name;
    const buttonText = () => props.event ? "Save Changes" : "Create Event";

    const validateEventName = (name: string) => {
        if (!name) {
            return false;
        }

        if (props.event && name === oldEventName) {
            return true;
        }

        return eventService.isNameUnique(name);
    };

    const validateEventChannel = (channel: string) => {
        return Object.values(EventChannel).includes(channel as EventChannel);
    };


    const [eventNameInput, setEventNameInput] = useState("");
    const [selectedEventChannel, setSelectedEventChannel] = useState<string>(EventChannel.GLOBAL);

    const [eventNameIsValid, setEventNameIsValid] = useState(props.event ? validateEventName(props.event.name) : false);
    const [eventChannelIsValid, setEventChannelIsValid] = useState(true);
    const [selectedContextVariables, setSelectedContextVariables] = useState<ContextVariable[]>([]);

    useEffect(() => {
        if(props.event){
            setEventNameInput(props.event.name);
            setSelectedEventChannel(props.event.channel)
            setSelectedContextVariables(props.event.data)
            validateEventName(props.event.name);
            validateEventChannel(props.event.channel);
        }
    }, []);

    // Handle context variable form submission
    const onContextSubmit = (newVar: ContextVariable) => {
        setSelectedContextVariables((prevVars) => {
            const existingVar = prevVars.find((v) => v.name === newVar.name);
            if (existingVar) {
                existingVar.name = newVar.name;
                existingVar.value = newVar.value;
                return [...prevVars];
            } else {
                return [...prevVars, newVar];
            }
        })

    };

    const onEventNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setEventNameInput(value);
        setEventNameIsValid(validateEventName(value));
    }, []);

    const onSelectedEventChannelChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedEventChannel(value);
        setEventChannelIsValid(validateEventChannel(value));
    }, []);



    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation()

        let updatedEvent: Event;
        if (props.event) {
            if (oldEventName !== eventNameInput) {
                eventService.renameEvent(props.event, eventNameInput);
            }
            props.event.data = selectedContextVariables;
            props.event.channel = selectedEventChannel as EventChannel;
            updatedEvent = props.event;
        } else {
            const newEvent = new Event(eventNameInput, selectedEventChannel as EventChannel);
            newEvent.data = selectedContextVariables;
            eventService.registerEvent(newEvent);
            updatedEvent = newEvent;
        }

        if(props.setVars){
            props.setVars((prevState) => {
                return [...prevState, ...selectedContextVariables].filter((item, index, vars) => {
                    return vars.findIndex(v => v.name === item.name) === index
                });
            })
        }
        props.onSubmit(updatedEvent);
    };

    return (
        <Form onSubmit={onSubmit}>

            <Form.Group className="mb-3">
                <Form.Label style={{color: darkMode ? "#ffffff" : "#000000"}}>Name</Form.Label>
                <Form.Control
                    type={"text"}
                    value={eventNameInput}
                    onChange={onEventNameChange}
                    required={true}
                    isValid={eventNameIsValid}
                    isInvalid={!eventNameIsValid}>
                </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label style={{color: darkMode ? "#ffffff" : "#000000"}}>EventChannel</Form.Label>
                <Form.Select value={selectedEventChannel} onChange={onSelectedEventChannelChange} isValid={eventChannelIsValid}>
                    {renderEnumAsOptions(EventChannel)}
                </Form.Select>
            </Form.Group>

            <Form.Group className={"mb-3"}>
                <Form.Label style={{color: darkMode ? "#ffffff" : "#000000"}}>Context Variables</Form.Label>
                <Row className={"mb-3"}>
                    <Col sm={6}>
                        <SelectContextsModal buttonName={"Select Context"} vars={selectedContextVariables} setVars={setSelectedContextVariables} />
                    </Col>
                    <Col sm={6}>
                        <CreateContextFormModal variable={undefined} buttonName={"Create new"} onSubmit={onContextSubmit} noCascadeClose={true} />
                    </Col>
                </Row>
                <ContextCardDisplay vars={selectedContextVariables} headerText={"Selected Variables"} setVars={setSelectedContextVariables} />
            </Form.Group>

            <Button variant="primary" type="submit">{buttonText()}</Button>
        </Form>
    );
}
