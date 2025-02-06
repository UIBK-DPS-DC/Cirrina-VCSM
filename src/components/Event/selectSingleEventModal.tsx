import React, {SetStateAction, useCallback, useContext, useState} from "react";
import Event from "../../classes/event.ts";
import {customSelectStyles, ReactFlowContext} from "../../utils.tsx";
import {ReactFlowContextProps} from "../../types.ts";
import {Button, Container, Form, Row} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import CreatableSelect from "react-select/creatable";
import {ActionMeta, OnChangeValue} from "react-select";
import {EventChannel} from "../../enums.ts";

export default function SelectSingleEventModal(props: {event: Event | undefined,
    setEvent: React.Dispatch<SetStateAction<Event | undefined>>,
    buttonText?: string,
    modalTitle?: string, onClear?: () => void}) {

    const context = useContext(ReactFlowContext) as ReactFlowContextProps
    const {eventService, darkMode} = context

    const buttonText = () => props.buttonText ? props.buttonText : "Select Event"
    const modalTitle = () => props.modalTitle ? props.modalTitle : buttonText()

    const [selectedEvent, setSelectedEvent] = useState<{value:string, label:string} | undefined>(undefined)
    const [selectedInternalEvent, setSelectedInternalEvent] = useState<{value:string, label:string} | undefined>(undefined)
    const [selectedExternalEvent, setSelectedExternalEvent] = useState<{value:string, label:string} | undefined>(undefined)
    const [selectedGlobalEvent, setSelectedGlobalEvent] = useState<{value:string, label:string} | undefined>(undefined)
    const [selectedPeripheralEvent, setSelectedPeripheralEvent] = useState<{value:string, label:string} | undefined>(undefined)

    const [show,setShow]=React.useState(false);

    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false);


    const internalEventSelectIsDisabled = () => !!(selectedExternalEvent || selectedGlobalEvent || selectedPeripheralEvent)
    const externalEventSelectIsDisabled = () => !!(selectedInternalEvent || selectedGlobalEvent || selectedPeripheralEvent)
    const globalEventSelectIsDisabled = () => !!(selectedInternalEvent || selectedExternalEvent || selectedPeripheralEvent)
    const peripheralEventSelectIsDisabled = () => !!(selectedInternalEvent || selectedExternalEvent || selectedGlobalEvent)


    const getEventLabel = (event: Event) => {
        return `${event.name}`
    }
    const renderEventsAsOptions = useCallback(((events: Event[]) => {
        return events.map((e) => {
            return {value: e.name, label: getEventLabel(e)}
        })


    }),[eventService])


    const onInternalEventCreate = (eventName: string) => {
        const res = eventService.registerEvent(new Event(eventName, EventChannel.INTERNAL))
        if(res){
            setSelectedInternalEvent({value: eventName, label: eventName})
            setSelectedEvent({value: eventName, label: eventName})
            return
        }
        console.error(`Event with name ${eventName} already exists`)
    }

    const onExternalEventCreate = (eventName: string) => {
        const res = eventService.registerEvent(new Event(eventName, EventChannel.EXTERNAL))
        if(res){
            setSelectedExternalEvent({value: eventName, label: eventName})
            setSelectedEvent({value: eventName, label: eventName})
            return
        }
        console.error(`Event with name ${eventName} already exists`)
    }

    const onGlobalEventCreate = (eventName: string) => {
        const res = eventService.registerEvent(new Event(eventName, EventChannel.GLOBAL))
        if(res){
            setSelectedGlobalEvent({value: eventName, label: eventName})
            setSelectedEvent({value: eventName, label: eventName})
            return
        }
        console.error(`Event with name ${eventName} already exists`)
    }

    const onPeripheralEventCreate = (eventName: string) => {
        const res = eventService.registerEvent(new Event(eventName, EventChannel.PERIPHERAL))
        if(res){
            setSelectedPeripheralEvent({value: eventName, label: eventName})
            setSelectedEvent({value: eventName, label: eventName})
            return
        }
        console.error(`Event with name ${eventName} already exists`)
    }

    const handleInternalEventChange = (
        newValue: OnChangeValue<{value: string, label: string}, false>,
        actionMeta: ActionMeta<{value: string, label: string}>
    ) => {
        if (actionMeta.action === 'clear') {
            setSelectedInternalEvent(undefined);
            setSelectedEvent(undefined);
        } else if (newValue) {
            setSelectedInternalEvent(newValue);
            setSelectedEvent(newValue);
        }
    };

    const handleExternalEventChange = (
        newValue: OnChangeValue<{value: string, label: string}, false>,
        actionMeta: ActionMeta<{value: string, label: string}>
    ) => {
        if (actionMeta.action === 'clear') {
            setSelectedExternalEvent(undefined);
            setSelectedEvent(undefined);
        } else if (newValue) {
            setSelectedExternalEvent(newValue);
            setSelectedEvent(newValue);
        }
    };

    const handleGlobalEventChange = (
        newValue: OnChangeValue<{value: string, label: string}, false>,
        actionMeta: ActionMeta<{value: string, label: string}>
    ) => {
        if (actionMeta.action === 'clear') {
            setSelectedGlobalEvent(undefined);
            setSelectedEvent(undefined);
        } else if (newValue) {
            setSelectedGlobalEvent(newValue);
            setSelectedEvent(newValue);
        }
    };

    const handlePeripheralEventChange = (
        newValue: OnChangeValue<{value: string, label: string}, false>,
        actionMeta: ActionMeta<{value: string, label: string}>
    ) => {
        if (actionMeta.action === 'clear') {
            setSelectedPeripheralEvent(undefined);
            setSelectedEvent(undefined);
        } else if (newValue) {
            setSelectedPeripheralEvent(newValue);
            setSelectedEvent(newValue);
        }
    };




    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        event.stopPropagation()

        if(props.event){

            //Event was cleared
            if(!selectedEvent){
                props.setEvent(undefined)
                if(props.onClear){
                    props.onClear()
                }
                handleClose()
                return;
            }

            // Event was changed
            const onEvent = eventService.getEventByName(selectedEvent.value)

            props.setEvent(onEvent)
            handleClose()
        }
        else {
            if(!selectedEvent){
                return
            }

            const onEvent = eventService.getEventByName(selectedEvent.value)

            if(!onEvent){
                return;
            }

            props.setEvent(onEvent)
            handleClose()
        }


    }

    return (
        <Container>
            <Button variant="primary" onClick={handleShow}>
                {buttonText()}
            </Button>

            <Modal show={show} onHide={handleClose} data-bs-theme={darkMode ? "dark" : "light"}>
                <Modal.Header closeButton={true}>
                    <Modal.Title style={{color: darkMode ? "#ffffff" : "#000000"}}>
                        {modalTitle()}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>


                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId={"formInternalEvents"}>
                            <Row>
                                <Form.Label  style={{color: darkMode ? "#ffffff" : "#000000"}}>Internal Events</Form.Label>
                            </Row>
                            <Row className={"mb-3"}>
                                <CreatableSelect closeMenuOnSelect={false}
                                                 options={renderEventsAsOptions(eventService.getAllInternalEvents())}
                                                 isClearable
                                                 isDisabled={internalEventSelectIsDisabled()}
                                                 value={selectedInternalEvent}
                                                 onChange={handleInternalEventChange}
                                                 onCreateOption={onInternalEventCreate}
                                                 styles={customSelectStyles}>
                                </CreatableSelect>
                            </Row>
                        </Form.Group>

                        <Form.Group controlId={"formExternalEvents"}>
                            <Row>
                                <Form.Label  style={{color: darkMode ? "#ffffff" : "#000000"}}>External Events</Form.Label>
                            </Row>
                            <Row className={"mb-3"}>
                                <CreatableSelect closeMenuOnSelect={false}
                                                 options={renderEventsAsOptions(eventService.getAllExternalEvents())}
                                                 isClearable
                                                 isDisabled={externalEventSelectIsDisabled()}
                                                 value={selectedExternalEvent}
                                                 onChange={handleExternalEventChange}
                                                 onCreateOption={onExternalEventCreate}
                                                 styles={customSelectStyles}>
                                </CreatableSelect>
                            </Row>
                        </Form.Group>

                        <Form.Group controlId={"formGlobalEvents"}>
                            <Row>
                                <Form.Label  style={{color: darkMode ? "#ffffff" : "#000000"}}>Global Events</Form.Label>
                            </Row>
                            <Row className={"mb-3"}>
                                <CreatableSelect closeMenuOnSelect={false}
                                                 options={renderEventsAsOptions(eventService.getAllGlobalEvents())}
                                                 isClearable
                                                 isDisabled={globalEventSelectIsDisabled()}
                                                 value={selectedGlobalEvent}
                                                 onChange={handleGlobalEventChange}
                                                 onCreateOption={onGlobalEventCreate}
                                                 styles={customSelectStyles}>
                                </CreatableSelect>
                            </Row>
                        </Form.Group>

                        <Form.Group controlId={"formPeripheralEvents"}>
                            <Row>
                                <Form.Label  style={{color: darkMode ? "#ffffff" : "#000000"}}>Peripheral Events</Form.Label>
                            </Row>
                            <Row className={"mb-3"}>

                                <CreatableSelect closeMenuOnSelect={false}
                                                 options={renderEventsAsOptions(eventService.getAllPeripheralEvents())}
                                                 isClearable
                                                 isDisabled={peripheralEventSelectIsDisabled()}
                                                 value={selectedPeripheralEvent}
                                                 onChange={handlePeripheralEventChange}
                                                 onCreateOption={onPeripheralEventCreate}
                                                 styles={customSelectStyles}>
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