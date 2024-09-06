import Modal from "react-bootstrap/Modal";
import Event from "../../classes/event.ts";
import {Button, Container, ModalBody} from "react-bootstrap";
import React from "react";

export default function CreateEventModal(props: {event: Event | undefined, onSubmit: (updatedEvent: Event) => void}) {

    const [show, setShow] = React.useState(false);

    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)

    const buttonText = () => props.event ? "Edit Event" : "Create Event";
    const modalTitle = () => props.event && props.event.name ? props.event.name : "New Event";

    return(
        <Container>
            <Button onClick={handleShow}>{buttonText()}</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle()}</Modal.Title>
                </Modal.Header
                >
                <ModalBody>
                    <h2>This is the Modals body</h2>
                </ModalBody>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )

}