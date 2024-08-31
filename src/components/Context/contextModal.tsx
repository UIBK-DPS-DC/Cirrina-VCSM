import {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ContextVariable from "../../classes/contextVariable.tsx";
import {Container} from "react-bootstrap";
import ContextForm from "./contextForm.tsx";


export default function ContextModal(props: {variable: ContextVariable | undefined}) {

    const [show,setShow]=useState(false);



    const handleShow = () => setShow(true)
    const handleClose= () => setShow(false)

    const buttonName = () => props.variable ? "Edit" : "Create new Context variable"
    const modalTitle = () => props.variable ? props.variable.name : "New Context variable"


    return (
        <Container>
            <Button variant="primary" onClick={handleShow}>
                {buttonName()}
            </Button>

            <Modal show={show}
            onHide={handleClose}
            backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title >{modalTitle()}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <ContextForm variable={props.variable} onClose={handleClose} />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>

            </Modal>
        </Container>


    )








}