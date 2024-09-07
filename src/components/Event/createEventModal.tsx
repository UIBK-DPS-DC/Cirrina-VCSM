import Modal from "react-bootstrap/Modal";
import Event from "../../classes/event.ts";
import {Button, Container, ModalBody} from "react-bootstrap";
import React, {Dispatch, SetStateAction} from "react";
import CreateEventForm from "./createEventForm.tsx";
import ContextVariable from "../../classes/contextVariable.tsx";

export default function CreateEventModal(props: {event: Event | undefined, onSubmit: (updatedEvent: Event) => void, noCloseCascade?: Boolean, setVars?: Dispatch<SetStateAction<ContextVariable[]>>}) {

    const [show, setShow] = React.useState(false);

    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)

    const buttonText = () => props.event ? "Edit Event" : "Create Event";
    const modalTitle = () => props.event && props.event.name ? props.event.name : "New Event";

    const onSubmit = (event: Event) => {
        if(props.onSubmit){
            props.onSubmit(event);
        }
        if(!props.noCloseCascade){
            handleClose();
        }

    }
    return(
        <Container>
            <Button onClick={handleShow}>{buttonText()}</Button>
            <Modal show={show} onHide={handleClose} backdrop={"static"}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle()}</Modal.Title>
                </Modal.Header
                >
                <ModalBody>
                   <CreateEventForm event={props.event} onSubmit={onSubmit} setVars={props.setVars}></CreateEventForm>
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