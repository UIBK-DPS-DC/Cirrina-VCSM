import {Button, Container, Form, Row} from "react-bootstrap";
import Event from "../../classes/event.ts";
import Modal from "react-bootstrap/Modal";
import React, {Dispatch, SetStateAction, useCallback, useContext, useEffect, useState} from "react";
import {ReactFlowContext} from "../../utils.tsx";
import {ReactFlowContextProps} from "../../types.ts";
import {ActionMeta, OnChangeValue} from "react-select";
import CreatableSelect from 'react-select/creatable';
import {EventChannel} from "../../enums.ts";


export default function SelectEventsModal(props:{buttonName: string | undefined,
    modalTitle: string | undefined,
    events: Event[] | [],
    setEvents: Dispatch<SetStateAction<Event[]>>, multiple?: boolean} ) {

    const context = useContext(ReactFlowContext) as ReactFlowContextProps
    const {eventService, selectedNode,selectedEdge} = context;

    const INTERNAL_EVENTS_SELECT_NAME = "internal-event-select";
    const EXTERNAL_EVENTS_SELECT_NAME  = "external-event-select";
    const GLOBAL_EVENTS_SELECT_NAME = "global-event-select";
    const PERIPHERAL_EVENTS_SELECT_NAME = "peripheral-event-select";


    const [show,setShow]=React.useState(false);

    const allowMultiple = () => props.multiple !== undefined ? props.multiple : true
    const isSelectDisabled = () => !allowMultiple() && ((selectedExternalEvents.length + selectedInternalEvents.length + selectedGlobalEvents.length + selectedPeripheralEvents.length) > 0)

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
    const renderEventsAsOptions = useCallback(((events: Event[]) => {
        return events.map((e) => {
            return {value: e.name, label: getEventLabel(e)}
        })


    }),[eventService])

    const getSelectedOptions = (selectedEvents: string[], allEvents: Event[]) => {
        const options = renderEventsAsOptions(allEvents);
        return options.filter(option => selectedEvents.includes(option.value));
    }

    const onInternalEventCreate = (eventName: string) => {
        const res = eventService.registerEvent(new Event(eventName, EventChannel.INTERNAL))
        if(res){
            setSelectedInternalEvents((prevEvents) => [...prevEvents, {value: eventName, label: eventName}])
            return
        }
        console.error(`Event with name ${eventName} already exists`)
    }

    const onExternalEventCreate = (eventName: string) => {
        const res = eventService.registerEvent(new Event(eventName, EventChannel.EXTERNAL))
        if(res){
            setSelectedExternalEvents((prevEvents) => [...prevEvents, {value: eventName, label: eventName}])
            return
        }
        console.error(`Event with name ${eventName} already exists`)
    }

    const onGlobalEventCreate = (eventName: string) => {
        const res = eventService.registerEvent(new Event(eventName, EventChannel.GLOBAL))
        if(res){
            setSelectedGlobalEvents((prevEvents) => [...prevEvents, {value: eventName, label: eventName}])
            return
        }
        console.error(`Event with name ${eventName} already exists`)
    }

    const onPeripheralEventCreate = (eventName: string) => {
        const res = eventService.registerEvent(new Event(eventName, EventChannel.PERIPHERAL))
        if(res){
            setSelectedPeripheralEvents((prevEvents) => [...prevEvents, {value: eventName, label: eventName}])
            return
        }
        console.error(`Event with name ${eventName} already exists`)
    }

    const clearEvents = () => {
        const events: {label: string, value: string}[]  = []
        setSelectedInternalEvents(events)
        setSelectedGlobalEvents(events)
        setSelectedPeripheralEvents(events)
        setSelectedExternalEvents(events)
        props.setEvents([])
    }




    useEffect(() => {
        setSelectedInternalEvents(getSelectedOptions(props.events.map((e) => e.name), eventService.getAllInternalEvents()))
        setSelectedPeripheralEvents(getSelectedOptions(props.events.map((e) => e.name), eventService.getAllPeripheralEvents()))
        setSelectedGlobalEvents(getSelectedOptions(props.events.map((e) => e.name), eventService.getAllGlobalEvents()))
        setSelectedExternalEvents(getSelectedOptions(props.events.map((e) => e.name), eventService.getAllExternalEvents()))
    }, [props.events, props.setEvents, eventService]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation()
        if(!selectedNode && !selectedEdge){
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
                                        <CreatableSelect closeMenuOnSelect={false}
                                                         isMulti={allowMultiple()}
                                                         isDisabled={isSelectDisabled()}
                                                         name={INTERNAL_EVENTS_SELECT_NAME}
                                                         options={renderEventsAsOptions(eventService.getAllInternalEvents())}
                                                         value={selectedInternalEvents}
                                                        //@ts-ignore
                                                         onChange={onSelectedInternalEventsChange}
                                                         onCreateOption={onInternalEventCreate}>
                                        </CreatableSelect>
                                </Row>
                                {isSelectDisabled() && selectedInternalEvents.length > 0 && (
                                    <Button variant="danger" className={"mb-3"} onClick={clearEvents}>
                                        Remove
                                    </Button>
                                )}
                            </Form.Group>

                            <Form.Group controlId={"formExternalEvents"}>
                                <Row>
                                    <Form.Label>External Events</Form.Label>
                                </Row>
                                <Row className={"mb-3"}>
                                        <CreatableSelect closeMenuOnSelect={false}
                                                         isMulti={allowMultiple()}
                                                         isDisabled={isSelectDisabled()}
                                                         name={EXTERNAL_EVENTS_SELECT_NAME}
                                                         options={renderEventsAsOptions(eventService.getAllExternalEvents())}
                                                         value={selectedExternalEvents}
                                                         //@ts-ignore
                                                         onChange={onSelectedExternalEventsChange}
                                                         onCreateOption={onExternalEventCreate}>
                                        </CreatableSelect>
                                </Row>
                            </Form.Group>

                            <Form.Group controlId={"formGlobalEvents"}>
                                <Row>
                                    <Form.Label>Global Events</Form.Label>
                                </Row>
                                <Row className={"mb-3"}>
                                        <CreatableSelect closeMenuOnSelect={false}
                                                         isMulti={allowMultiple()}
                                                         isDisabled={isSelectDisabled()}
                                                         name={GLOBAL_EVENTS_SELECT_NAME}
                                                         options={renderEventsAsOptions(eventService.getAllGlobalEvents())}
                                                         value={selectedGlobalEvents}
                                                         //@ts-ignore
                                                         onChange={onSelectedGlobalEventsChange}
                                                         onCreateOption={onGlobalEventCreate}>
                                        </CreatableSelect>
                                </Row>
                            </Form.Group>

                            <Form.Group controlId={"formPeripheralEvents"}>
                                <Row>
                                    <Form.Label>Peripheral Events</Form.Label>
                                </Row>
                                <Row className={"mb-3"}>

                                        <CreatableSelect closeMenuOnSelect={false}
                                                         isMulti={allowMultiple()}
                                                         isDisabled={isSelectDisabled()}
                                                         name={PERIPHERAL_EVENTS_SELECT_NAME}
                                                         options={renderEventsAsOptions(eventService.getAllPeripheralEvents())}
                                                         value={selectedPeripheralEvents}
                                                         //@ts-ignore
                                                         onChange={onSelectedPeripheralEventsChange}
                                                         onCreateOption={onPeripheralEventCreate}>
                                        </CreatableSelect>
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