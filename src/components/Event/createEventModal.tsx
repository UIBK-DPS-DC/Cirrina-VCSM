import Modal from "react-bootstrap/Modal";
import Event from "../../classes/event.ts";
import {Button, Container, ModalBody} from "react-bootstrap";
import React, {Dispatch, SetStateAction, useContext} from "react";
import CreateEventForm from "./createEventForm.tsx";
import ContextVariable from "../../classes/contextVariable.tsx";
import {ReactFlowContext} from "../../utils.tsx";
import {ReactFlowContextProps} from "../../types.ts";

export default function CreateEventModal(props: {event: Event | undefined, onSubmit: (updatedEvent: Event) => void, noCloseCascade?: Boolean, setVars?: Dispatch<SetStateAction<ContextVariable[]>>, buttonVariant? :string, buttonSize? : "sm" | "lg"}) {

    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {darkMode} = context
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
            <Button onClick={handleShow} variant={props.buttonVariant ? props.buttonVariant : "primary"} size={props.buttonSize ? props.buttonSize : undefined}>
                {buttonText()}
            </Button>
            <Modal show={show} onHide={handleClose} backdrop={"static"} data-bs-theme={darkMode ? "dark" : "light"}>
                <Modal.Header closeButton style={{color: darkMode ? "#ffffff" : "#000000"}}>
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