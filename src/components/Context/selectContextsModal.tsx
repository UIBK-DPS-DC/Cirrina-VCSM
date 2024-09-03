import {Button, Container, Form, ModalBody} from "react-bootstrap";
import {Dispatch, SetStateAction, useState} from "react";
import Modal from "react-bootstrap/Modal";

export default function SelectContextsModal(props: {buttonName: string | undefined, vars: string[], setVars: Dispatch<SetStateAction<string[]>>}){

    const[show,setShow]=useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const buttonName = () => props.buttonName ? props.buttonName : "Select Context"


    return (
        <Container>
            <Button variant={"primary"} onClick={()=>{handleShow()}}>
                {buttonName()}
            </Button>

            <Modal show={show}
            onHide={handleClose}>

                <Modal.Header closeButton>
                    <Modal.Title>Select Context</Modal.Title>
                </Modal.Header>

                <ModalBody>
                    <Form>
                        <Form.Label>Select Context Variables</Form.Label>
                        <Form.Select multiple={true}>
                            <option>Test 1</option>
                            <option>Test 2</option>
q                        </Form.Select>
                    </Form>
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