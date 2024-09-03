import {Button, Container, Form, ModalBody} from "react-bootstrap";
import {Dispatch, SetStateAction, useCallback, useContext, useEffect, useState} from "react";
import Modal from "react-bootstrap/Modal";
import {ReactFlowContext} from "../../utils.tsx";
import {CsmNodeProps, ReactFlowContextProps} from "../../types.ts";
import {Node} from "@xyflow/react";
import ContextVariable from "../../classes/contextVariable.tsx";

export default function SelectContextsModal(props: {buttonName: string | undefined, vars: string[], setVars: Dispatch<SetStateAction<string[]>>}){

    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {nodes,
    selectedNode,
    contextService} = context

    const getKnownContextVariables = useCallback((node: Node<CsmNodeProps>) => {
        console.log(`Test ${node}`)
    },[selectedNode, nodes]);

    const getPersistentContextVariables = useCallback(() => {
        let persistentContext: ContextVariable[] = []
        nodes.forEach((node: Node<CsmNodeProps>) => {
             persistentContext = persistentContext.concat(contextService.getPersistentContext(node.data))
        })
        return persistentContext;

    },[nodes])

    useEffect(() => {
        getPersistentContextVariables()
    }, []);


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
                            { getPersistentContextVariables().map((v) => {
                                return(
                                    <option>{v.name} : {v.value}</option>
                                )
                            })}
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