import {Button, Container, Form, Row} from "react-bootstrap";
import Event from "../../classes/event.ts";
import Modal from "react-bootstrap/Modal";
import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {ReactFlowContext} from "../../utils.tsx";
import {ReactFlowContextProps} from "../../types.ts";
import Select, {ActionMeta, OnChangeValue} from "react-select";


export default function SelectEventsModal(props:{buttonName: string | undefined , modalTitle: string | undefined, events: Event[] | [], setEvents: Dispatch<SetStateAction<Event[]>>} ) {

    const context = useContext(ReactFlowContext) as ReactFlowContextProps
    const {eventService, selectedNode} = context;

    const INTERNAL_EVENTS_SELECT_NAME = "internal-event-select";
    const EXTERNAL_EVENTS_SELECT_NAME  = "external-event-select";
    const GLOBAL_EVENTS_SELECT_NAME = "global-event-select";
    const PERIPHERAL_EVENTS_SELECT_NAME = "peripheral-event-select";

    const [show,setShow]=React.useState(false);

    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false);

    const buttonName = props.buttonName ? props.buttonName : "Select Events";
    const modalTitle = () => props.modalTitle ? props.modalTitle : "Select Events"

    
    const [selectedInternalEvents,  setSelectedInternalEvents] = useState<readonly {value:string, label:string}[]>([])

    const onSelectedInternalEventsChange = (
        newValue: OnChangeValue<{value: string, label: string}, true>,
        actionMeta: ActionMeta<{value: string, label: string}>
    ) => {
        switch (actionMeta.action) {
            case 'remove-value':
            case 'pop-value':
                break;
            case 'clear':
                newValue = []
                break;
        }

        setSelectedInternalEvents(newValue);
    };

    const [selectedExternalEvents, setSelectedExternalEvents] = useState<readonly {value:string, label:string}[]>([])

    const onSelectedExternalEventsChange = (
        newValue: OnChangeValue<{value: string, label: string}, true>,
        actionMeta: ActionMeta<{value: string, label: string}>
    ) => {
        switch (actionMeta.action) {
            case 'remove-value':
            case 'pop-value':
                break;
            case 'clear':
                newValue = []
                break;
        }

        setSelectedExternalEvents(newValue);
    };

    const [selectedGlobalEvents, setSelectedGlobalEvents] = useState<readonly {value:string, label:string}[]>([])

    const onSelectedGlobalEventsChange = (
        newValue: OnChangeValue<{value: string, label: string}, true>,
        actionMeta: ActionMeta<{value: string, label: string}>
    ) => {
        switch (actionMeta.action) {
            case 'remove-value':
            case 'pop-value':
                break;
            case 'clear':
                newValue = []
                break;
        }

        setSelectedGlobalEvents(newValue);
    };

    const [selectedPeripheralEvents, setSelectedPeripheralEvents] = useState<readonly {value:string, label:string}[]>([])
    const onSelectedPeripheralEventsChange = (
        newValue: OnChangeValue<{value: string, label: string}, true>,
        actionMeta: ActionMeta<{value: string, label: string}>
    ) => {
        switch (actionMeta.action) {
            case 'remove-value':
            case 'pop-value':
                break;
            case 'clear':
                newValue = []
                break;
        }

        setSelectedPeripheralEvents(newValue);
    };

    const getEventLabel = (event: Event) => {
        return `${event.name} - ${event.channel}`
    }
    const renderEventsAsOptions = (events: Event[]) => {
        return events.map((e) => {
            return {value: e.name, label: getEventLabel(e)}
        })


    }

    const getSelectedOptions = (selectedEvents: string[], allEvents: Event[]) => {
        const options = renderEventsAsOptions(allEvents);
        return options.filter(option => selectedEvents.includes(option.value));
    }

    useEffect(() => {
        setSelectedInternalEvents(getSelectedOptions(props.events.map((e) => e.name), eventService.getAllInternalEvents()))
        setSelectedPeripheralEvents(getSelectedOptions(props.events.map((e) => e.name), eventService.getAllPeripheralEvents()))
        setSelectedGlobalEvents(getSelectedOptions(props.events.map((e) => e.name), eventService.getAllGlobalEvents()))
        setSelectedExternalEvents(getSelectedOptions(props.events.map((e) => e.name), eventService.getAllExternalEvents()))
    }, [props.events, props.setEvents, eventService]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!selectedNode){
            return;
        }

        const internalEvents: Event[] = []
        selectedInternalEvents.forEach(e => {
            const event = eventService.getEventByName(e.value)
            if(event){
                internalEvents.push(event)
            }
        })

        const peripheralEvents: Event[] = []
        selectedPeripheralEvents.forEach(e => {
            const event = eventService.getEventByName(e.value)
            if(event){
                internalEvents.push(event)
            }
        })

        const globalEvents: Event[] = []
        selectedGlobalEvents.forEach(e => {
            const event = eventService.getEventByName(e.value)
            if(event){
                internalEvents.push(event)
            }
        })

        const externalEvents: Event[] = []
        selectedExternalEvents.forEach(e => {
            const event = eventService.getEventByName(e.value)
            if(event){
                internalEvents.push(event)
            }
        })

        props.setEvents([...internalEvents, ...externalEvents, ...peripheralEvents, ...globalEvents]);
        handleClose()

    }

    return(
        <Container>
            <Button variant="primary" onClick={handleShow}>
                {buttonName}
            </Button>
            
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton={true}>
                        <Modal.Title>
                            {modalTitle()}
                        </Modal.Title>
                </Modal.Header>

                    <Modal.Body>

                        <div className={"mb-3"}>
                            <small className="text-decoration-underline text-muted">
                                You can select multiple events by holding CTRL
                            </small>
                        </div>
                        
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId={"formInternalEvents"}>
                                <Row>
                                    <Form.Label>Internal Events</Form.Label>
                                </Row>
                                <Row className={"mb-3"}>
                                    {eventService.getAllInternalEvents().length > 0 && (
                                        <Select closeMenuOnSelect={false} isMulti={true} name={INTERNAL_EVENTS_SELECT_NAME}
                                                options={renderEventsAsOptions(eventService.getAllInternalEvents())} value={selectedInternalEvents} onChange={onSelectedInternalEventsChange}>
                                        </Select>
                                    ) || (<Form.Text muted>No internal events found</Form.Text>)}
                                </Row>
                            </Form.Group>

                            <Form.Group controlId={"formExternalEvents"}>
                                <Row>
                                    <Form.Label>External Events</Form.Label>
                                </Row>
                                <Row className={"mb-3"}>
                                    {eventService.getAllExternalEvents().length > 0 && (
                                        <Select closeMenuOnSelect={false} isMulti={true} name={EXTERNAL_EVENTS_SELECT_NAME}
                                                options={renderEventsAsOptions(eventService.getAllExternalEvents())} value={selectedExternalEvents} onChange={onSelectedExternalEventsChange}>
                                        </Select>
                                    ) || (<Form.Text muted>No External events found</Form.Text>)}
                                </Row>
                            </Form.Group>

                            <Form.Group controlId={"formGlobalEvents"}>
                                <Row>
                                    <Form.Label>Global Events</Form.Label>
                                </Row>
                                <Row className={"mb-3"}>
                                    {eventService.getAllGlobalEvents().length > 0 && (
                                        <Select closeMenuOnSelect={false} isMulti={true} name={GLOBAL_EVENTS_SELECT_NAME}
                                                options={renderEventsAsOptions(eventService.getAllGlobalEvents())} value={selectedGlobalEvents} onChange={onSelectedGlobalEventsChange}>
                                        </Select>
                                    ) || (<Form.Text muted>No Global events found</Form.Text>)}
                                </Row>
                            </Form.Group>

                            <Form.Group controlId={"formPeripheralEvents"}>
                                <Row>
                                    <Form.Label>Peripheral Events</Form.Label>
                                </Row>
                                <Row className={"mb-3"}>
                                    {eventService.getAllPeripheralEvents().length > 0 && (
                                        <Select closeMenuOnSelect={false} isMulti={true} name={PERIPHERAL_EVENTS_SELECT_NAME}
                                                options={renderEventsAsOptions(eventService.getAllPeripheralEvents())} value={selectedPeripheralEvents} onChange={onSelectedPeripheralEventsChange}>
                                        </Select>
                                    ) || (<Form.Text muted>No Peripheral events found</Form.Text>)}
                                </Row>
                            </Form.Group>
                            <Button type={"submit"}>Save Selection</Button>

                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant={"secondary"} onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>

            </Modal>
        </Container>
    )
}