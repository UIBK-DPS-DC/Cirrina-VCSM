import Event from "../../classes/event.ts";
import {Button, Col, Form, Row} from "react-bootstrap";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {ReactFlowContext, renderEnumAsOptions} from "../../utils.tsx";
import {ReactFlowContextProps} from "../../types.ts";
import {EventChannel} from "../../enums.ts";
import ContextVariable from "../../classes/contextVariable.tsx";
import SelectContextsModal from "../Context/selectContextsModal.tsx";
import CreateContextFormModal from "../Context/createContextFormModal.tsx";
import ContextCardDisplay from "../Context/contextCardDisplay.tsx";
export default function CreateEventForm(props:{event: Event | undefined, onSubmit: (event: Event) => void}) {

    const context = useContext(ReactFlowContext) as ReactFlowContextProps
    const {eventService, selectedNode} = context

    const oldEventName = props.event?.name;
    const buttonText = () => props.event ? "Save Changes" : "Create Event"

    const [eventName, setEventName] = useState("");
    const [selectedEventChannel, setSelectedEventChannel] = useState<string>(EventChannel.GLOBAL)

    const [eventNameIsValid, setEventNameIsValid] = useState(false);
    const [eventChannelIsValid, setEventChannelIsValid] = useState(true);
    const [selectedContextVariables, setSelectedContextVariables] = useState<ContextVariable[]>([])

    const onContextSubmit = (newVar: ContextVariable) => {
        setSelectedContextVariables((prevVars) => {
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

    const invalidEventNameText = () => {
        return eventName? `${eventName} already exists` : "Name cant be empty"
    }


    const validateEventName = (name: string) => {
        if(!name){
            return false;
        }

        if(props.event && name === oldEventName){
            return true;
        }

        return eventService.isNameUnique(name)
    }

    const validateEventChannel = (channel: string) => {
        return Object.values(EventChannel).includes(channel as EventChannel);
    }





    const onEventNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const value = (event.target.value);
        setEventName(value)
        setEventNameIsValid(validateEventName(value))
    },[validateEventName])

    const onSelectedEventChannelChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedEventChannel(value);
        setEventChannelIsValid(validateEventChannel(value))
    },[setSelectedEventChannel,validateEventChannel])



    useEffect(() => {
        if(props.event){
            setEventName(props.event.name);
        }
    }, [props.event]);

    useEffect(() => {
        console.log(selectedEventChannel)
    }, [selectedEventChannel]);


    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!selectedNode) {
            return;
        }

    }

    return(
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                type={"text"}
                value={eventName}
                onChange={onEventNameChange}
                required={true}
                isValid={eventNameIsValid}
                isInvalid={!eventNameIsValid}>
                </Form.Control>

                <Form.Control.Feedback type="invalid">
                    {invalidEventNameText()}
                </Form.Control.Feedback>

                <Form.Text className={"text-muted"}>
                    The Events Name
                </Form.Text>

            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>EventChannel</Form.Label>
                <Form.Select value={selectedEventChannel} onChange={onSelectedEventChannelChange} isValid={eventChannelIsValid} isInvalid={!eventChannelIsValid}>
                    {renderEnumAsOptions(EventChannel)}
                </Form.Select>
            </Form.Group>

            <Form.Group>
                <Form.Label>Context Variables</Form.Label>
                <Row className={"mb-3"}>
                    <Col sm={6}>
                        <SelectContextsModal buttonName={"Select Context"} vars={selectedContextVariables} setVars={setSelectedContextVariables}/>
                    </Col>
                    <Col sm={6}>
                        <CreateContextFormModal variable={undefined} buttonName={"Create new"} onSubmit={onContextSubmit}></CreateContextFormModal>
                    </Col>
                </Row>
                <ContextCardDisplay vars={selectedContextVariables} headerText={"Selected Variables"} setVars={setSelectedContextVariables}/>
            </Form.Group>

            <Button variant="primary" type="submit">{buttonText()}</Button>

        </Form>
    )

}