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

    /**
     * Retrieves the local and static context variables for a given node and its parent nodes.
     *
     * This function starts by gathering the local and static context variables from the current node.
     * If the node has a parent extent, it recursively gathers context variables from sibling nodes with
     * the same parentId and from the parent node itself. This approach allows for the accumulation of
     * context variables up the node hierarchy.
     *
     * @param {Node<CsmNodeProps>} node - The node for which to retrieve context variables.
     * @returns {[ContextVariable[], ContextVariable[]]} - A tuple containing two arrays:
     *   1. The local context variables.
     *   2. The static context variables.
     */
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

    /**
     * Retrieves the local context variables that are known for the currently selected node.
     *
     * This function checks if a node is selected, then uses `getKnownContextVariables` to gather
     * all local context variables, ensuring that duplicates are removed.
     *
     * @returns {ContextVariable[]} - An array of unique local context variables.
     */
    const knownLocalContext = useCallback(() => {
        if(!selectedNode){
            return []
        }
        return getKnownContextVariables(selectedNode)[0].filter((value, index, vars) => {
            return vars.indexOf(value) === index;
        })
    },[getKnownContextVariables])

    /**
     * Retrieves the static context variables that are known for the currently selected node.
     *
     * This function checks if a node is selected, then uses `getKnownContextVariables` to gather
     * all static context variables, ensuring that duplicates are removed.
     *
     * @returns {ContextVariable[] | undefined} - An array of unique static context variables,
     *                                            or undefined if no node is selected.
     */
    const knownStaticContext = useCallback(() => {
        if(!selectedNode){
            return
        }
        return getKnownContextVariables(selectedNode)[1].filter((value, index, vars) => {
            return vars.indexOf(value) === index;
        })
    },[getKnownContextVariables])



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