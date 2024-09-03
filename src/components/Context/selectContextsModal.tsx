import {Button, Container, Form, ModalBody} from "react-bootstrap";
import {Dispatch, SetStateAction, useCallback, useContext, useState} from "react";
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
        let localContext: ContextVariable[] = []
        let staticContext: ContextVariable[] = []

        localContext = localContext.concat(contextService.getLocalContext(node.data))
        staticContext = staticContext.concat(contextService.getStaticContext(node.data))

        if(node.extent === "parent"){
            nodes.forEach((n) => {
                if(n.parentId === node.parentId){
                    localContext = localContext.concat(contextService.getLocalContext(n.data));
                    staticContext = staticContext.concat(contextService.getStaticContext(n.data));
                }
                if(n.id === node.parentId){
                    const parentRes = getKnownContextVariables(n)
                    localContext = localContext.concat(parentRes[0])
                    staticContext = staticContext.concat(parentRes[1])
                }
            })
        }

        return [localContext, staticContext]

    },[contextService, nodes]);

    const knownLocalContext = useCallback(() => {
        if(!selectedNode){
            return []
        }
        return getKnownContextVariables(selectedNode)[0].filter((value, index, vars) => {
            return vars.indexOf(value) === index;
        })
    },[getKnownContextVariables])

    const knownStaticContext = useCallback(() => {
        if(!selectedNode){
            return
        }
        return getKnownContextVariables(selectedNode)[1].filter((value, index, vars) => {
            return vars.indexOf(value) === index;
        })
    })



    const getPersistentContextVariables = useCallback(() => {
        let persistentContext: ContextVariable[] = []
        nodes.forEach((node: Node<CsmNodeProps>) => {
             persistentContext = persistentContext.concat(contextService.getPersistentContext(node.data))
        })
        return persistentContext;

    },[nodes])



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
                            {selectedNode && knownLocalContext().map((n) => {
                                return (
                                    <option key={`o-${n.name}`}>{n.name} : {n.value}</option>
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