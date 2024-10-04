import {useContext, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ContextVariable from "../../classes/contextVariable.tsx";
import { Container } from "react-bootstrap";
import CreateContextForm from "./createContextForm.tsx";
import {ReactFlowContext} from "../../utils.tsx";
import {ReactFlowContextProps} from "../../types.ts";

export default function CreateContextFormModal(props: { variable: ContextVariable | undefined, buttonName: string | undefined, onSubmit: ((updatedVariable: ContextVariable) => void) | undefined, noCascadeClose?: boolean, noRegister?: boolean }) {

    const [show, setShow] = useState(false);
    const context = useContext(ReactFlowContext) as ReactFlowContextProps
    const {darkMode} = context

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const buttonName = () => props.variable ? "Edit" : props.buttonName ? props.buttonName : "Create new Context variable";
    const modalTitle = () => props.variable ? props.variable.name : "New Context variable";

    // Handle form submission and notify the parent component
    const handleFormSubmit = (updatedVariable: ContextVariable) => {
        if (props.onSubmit) {
            props.onSubmit(updatedVariable);
        }
        if (!props.noCascadeClose) {
            handleClose();  // Close modal after submit
        }
    };

    return (
        <Container>
            <Button variant="primary" onClick={handleShow}>
                {buttonName()}
            </Button>

            <Modal show={show} onHide={handleClose} data-bs-theme={darkMode ? "dark" : "light"} backdrop="static" >
                <Modal.Header closeButton style={{color: "#ffffff"}}>
                    <Modal.Title>{modalTitle()}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <CreateContextForm variable={props.variable} onClose={handleClose} onSubmit={handleFormSubmit} noRegister={props.noRegister} />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
