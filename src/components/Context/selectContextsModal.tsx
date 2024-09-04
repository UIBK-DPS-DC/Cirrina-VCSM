import {Button, Container, Form, ModalBody, Row} from "react-bootstrap";
import React, {Dispatch, SetStateAction, useCallback, useContext, useState} from "react";
import Modal from "react-bootstrap/Modal";
import {ReactFlowContext} from "../../utils.tsx";
import {CsmNodeProps, isState, ReactFlowContextProps} from "../../types.ts";
import {Node} from "@xyflow/react";
import ContextVariable from "../../classes/contextVariable.tsx";

export default function SelectContextsModal(props: {buttonName: string | undefined, vars: string[], setVars: Dispatch<SetStateAction<string[]>>}){


    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {nodes,
    selectedNode,
    contextService} = context

    const PERSISTENT_CONTEXT_MULTISELECT_NAME = "selected-persistent-context"
    const LOCAL_CONTEXT_MULTISELECT_NAME = "selected-local-context"
    const STATIC_CONTEXT_MULTISELECT_NAME = "selected-static-context"

    const renderContextVariablesAsOptions = (vars: ContextVariable[]) => {
        return (
            vars.map((v) => {
                return <option key={v.name} value={v.name}>{v.name} : {v.value}</option>
            })
        )
    }

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
            return []
        }
        return getKnownContextVariables(selectedNode)[1].filter((value, index, vars) => {
            return vars.indexOf(value) === index;
        })
    },[getKnownContextVariables])


    /**
     * Retrieves all unique persistent context variables from the nodes in the current graph.
     *
     * This function iterates through all the nodes in the `nodes` array and accumulates their
     * persistent context variables using the `contextService.getPersistentContext` method.
     * After gathering all the persistent context variables, it filters out any duplicates to
     * ensure that the returned array only contains unique values.
     *
     * @returns {ContextVariable[]} - An array of unique persistent context variables.
     */
    const getPersistentContextVariables = useCallback(() => {
        let persistentContext: ContextVariable[] = []
        nodes.forEach((node: Node<CsmNodeProps>) => {
             persistentContext = persistentContext.concat(contextService.getPersistentContext(node.data))
        })
        return persistentContext.filter((value, index, vars) => {
            return vars.indexOf(value) === index;
        });

    },[nodes])



    const[show,setShow]=useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const buttonName = () => props.buttonName ? props.buttonName : "Select Context"


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if(!selectedNode){
            return;
        }

        const formElements = event.currentTarget.elements as typeof event.currentTarget.elements & {
            [PERSISTENT_CONTEXT_MULTISELECT_NAME]: HTMLSelectElement| null;
            [LOCAL_CONTEXT_MULTISELECT_NAME]: HTMLSelectElement | null;
            [STATIC_CONTEXT_MULTISELECT_NAME]: HTMLSelectElement | null;
        }

        const persistentSelect = formElements[PERSISTENT_CONTEXT_MULTISELECT_NAME];
        const localSelect = formElements[LOCAL_CONTEXT_MULTISELECT_NAME];
        const staticSelect = formElements[STATIC_CONTEXT_MULTISELECT_NAME];

        const selectedPersistentContext = persistentSelect ? Array.from(persistentSelect.selectedOptions).map(option => option.value) : [];
        const selectedLocalContext = localSelect ? Array.from(localSelect.selectedOptions).map(option => option.value) : [];
        const selectedStaticContext = staticSelect ? Array.from(staticSelect.selectedOptions).map(option => option.value) : [];

        console.log(selectedLocalContext);
        console.log(selectedStaticContext);
        console.log(selectedPersistentContext);




    }


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

                    <div className={"mb-3"}>
                        <small className="text-decoration-underline text-muted">
                            You can select multiple variables by holding CTRL
                        </small>
                    </div>

                    <Form onSubmit={handleSubmit}>

                        <Form.Group controlId={"fromPersistentContext"}>
                        <Row>
                                <Form.Label>Persistent Context</Form.Label>
                            </Row>
                            <Row className={"mb-3"}>
                                {getPersistentContextVariables().length > 0 && (
                                    <Form.Select multiple={true} name={PERSISTENT_CONTEXT_MULTISELECT_NAME}>
                                        {renderContextVariablesAsOptions(getPersistentContextVariables())}
                                    </Form.Select>
                                ) || (<Form.Text muted> No Persistent Context found</Form.Text>)}
                            </Row>
                        </Form.Group>

                        <Form.Group controlId={"fromLocalContext"}>
                            <Row>
                                <Form.Label>Local Context</Form.Label>
                            </Row>
                            <Row className={"mb-3"}>
                                {knownLocalContext().length > 0 && (
                                    <Form.Select multiple={true} name={LOCAL_CONTEXT_MULTISELECT_NAME}>
                                        {renderContextVariablesAsOptions(knownLocalContext())}
                                    </Form.Select>
                                ) || (<Form.Text muted> No Local Context found</Form.Text>)}
                            </Row>
                        </Form.Group>

                        {selectedNode && isState(selectedNode.data) && (
                            <Form.Group controlId={"fromStaticContext"}>
                                <Row>
                                    <Form.Label>Static Context</Form.Label>
                                </Row>
                                <Row className={"mb-3"}>
                                    {knownStaticContext().length > 0 && (
                                        <Form.Select multiple={true} name={STATIC_CONTEXT_MULTISELECT_NAME}>
                                            {renderContextVariablesAsOptions(knownStaticContext())}
                                        </Form.Select>
                                    ) || (<Form.Text muted> No Static Context found</Form.Text>)}
                                </Row>
                            </Form.Group>
                        )}

                        <Button type={"submit"}>Save Selection</Button>

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