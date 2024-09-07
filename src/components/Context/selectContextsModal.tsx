import {Button, Container, Form, ModalBody, Row} from "react-bootstrap";
import React, {Dispatch, SetStateAction, useCallback, useContext, useEffect, useState} from "react";
import Modal from "react-bootstrap/Modal";
import {ReactFlowContext} from "../../utils.tsx";
import {CsmNodeProps, isState, ReactFlowContextProps} from "../../types.ts";
import {Node} from "@xyflow/react";
import ContextVariable from "../../classes/contextVariable.tsx";
import Select, { ActionMeta, OnChangeValue } from 'react-select'

export default function SelectContextsModal(props: {buttonName: string | undefined, vars: ContextVariable[], setVars: Dispatch<SetStateAction<ContextVariable[]>>}){


    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {nodes,
    selectedNode,
    contextService} = context

    const PERSISTENT_CONTEXT_MULTISELECT_NAME = "selected-persistent-context"
    const LOCAL_CONTEXT_MULTISELECT_NAME = "selected-local-context"
    const STATIC_CONTEXT_MULTISELECT_NAME = "selected-static-context"

    const getSelectedOptions = (selectedVars: string[], allVars: ContextVariable[]) => {
        const options = renderContextVariablesAsOptions(allVars);
        return options.filter(option => selectedVars.includes(option.value));
    };

    const renderContextVariablesAsOptions = (vars: ContextVariable[]) => {
        return (
            vars.map((v) => {
                return {value: v.name, label: v.name + ": " + v.value}
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
    const getKnownLocalContext = useCallback(() => {
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
    const getKnownStaticContext = useCallback(() => {
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

    const [selectedPersistentVariables, setSelectedPersistentVariables] = useState<readonly {value:string, label:string}[]>(
        getSelectedOptions(props.vars.map((v) => v.name), getPersistentContextVariables())
    )

    const onSelectedPersistentVariablesChange = (
        newValue: OnChangeValue<{value: string, label: string}, true>,
        actionMeta: ActionMeta<{value: string, label: string}>
    ) => {
        switch (actionMeta.action) {
            case 'remove-value':
            case 'pop-value':
                break;
            case 'clear':
                newValue = []
                break;
        }

        setSelectedPersistentVariables(newValue);
    };



    const [selectedLocalVariables, setSelectedLocalVariables] = useState<readonly {value:string, label:string}[]>(
        getSelectedOptions(props.vars.map((v) => v.name), getKnownLocalContext())
    )

    const onSelectedLocalVariablesChange = (
        newValue: OnChangeValue<{value: string, label: string}, true>,
        actionMeta: ActionMeta<{value: string, label: string}>
    ) => {
        switch (actionMeta.action) {
            case 'remove-value':
            case 'pop-value':
                break;
            case 'clear':
                newValue = []
                break;
        }

        setSelectedLocalVariables(newValue);
    };

    const [selectedStaticVariables, setSelectedStaticVariables] = useState<readonly {value:string, label:string}[]>(
        getSelectedOptions(props.vars.map((v) => v.name), getKnownStaticContext())
    )

    const onSelectedStaticVariablesChange = (
        newValue: OnChangeValue<{value: string, label: string}, true>,
        actionMeta: ActionMeta<{value: string, label: string}>
    ) => {
        switch (actionMeta.action) {
            case 'remove-value':
            case 'pop-value':
                break;
            case 'clear':
                newValue = []
                break;
        }

        setSelectedStaticVariables(newValue);
    };

    useEffect(() => {
        setSelectedPersistentVariables(getSelectedOptions(props.vars.map((v) => v.name), getPersistentContextVariables()));
        setSelectedLocalVariables(getSelectedOptions(props.vars.map((v) => v.name), getKnownLocalContext()));
        setSelectedStaticVariables(getSelectedOptions(props.vars.map((v) => v.name), getKnownStaticContext()));
    }, [props.vars, getPersistentContextVariables, getKnownLocalContext, getKnownStaticContext]);






    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const buttonName = () => props.buttonName ? props.buttonName : "Select Context"


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        event.stopPropagation()

        if(!selectedNode){
            return;
        }


        const persistentVars: ContextVariable[] = []
        selectedPersistentVariables.forEach(variable => {
            const context = contextService.getContextByName(variable.value)
            if(context){
                persistentVars.push(context)
            }
        })

        const localVars: ContextVariable[] = []
        selectedLocalVariables.forEach(variable => {
            const context = contextService.getContextByName(variable.value)
            if(context){
                localVars.push(context)
            }
        })

        const staticVars: ContextVariable[] = []
        selectedStaticVariables.forEach(variable => {
            const context = contextService.getContextByName(variable.value)
            if(context){
                staticVars.push(context)
            }
        })

        props.setVars([...persistentVars,...localVars,...staticVars]);
        handleClose()




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
                                    <Select closeMenuOnSelect={false} isMulti={true} name={PERSISTENT_CONTEXT_MULTISELECT_NAME}
                                            options={renderContextVariablesAsOptions(getPersistentContextVariables())} value={selectedPersistentVariables} onChange={onSelectedPersistentVariablesChange}>
                                    </Select>
                                ) || (<Form.Text muted> No Persistent Context found</Form.Text>)}
                            </Row>
                        </Form.Group>

                        <Form.Group controlId={"fromLocalContext"}>
                            <Row>
                                <Form.Label>Local Context</Form.Label>
                            </Row>
                            <Row className={"mb-3"}>
                                {getKnownLocalContext().length > 0 && (
                                    <Select closeMenuOnSelect={false} isMulti={true} name={LOCAL_CONTEXT_MULTISELECT_NAME}
                                            options={renderContextVariablesAsOptions(getKnownLocalContext())} value={selectedLocalVariables} onChange={onSelectedLocalVariablesChange}>
                                    </Select>
                                ) || (<Form.Text muted> No Local Context found</Form.Text>)}
                            </Row>
                        </Form.Group>

                        {selectedNode && isState(selectedNode.data) && (
                            <Form.Group controlId={"fromStaticContext"}>
                                <Row>
                                    <Form.Label>Static Context</Form.Label>
                                </Row>
                                <Row className={"mb-3"}>
                                    {getKnownStaticContext().length > 0 && (
                                        <Select closeMenuOnSelect={false} isMulti={true} name={STATIC_CONTEXT_MULTISELECT_NAME}
                                                options={renderContextVariablesAsOptions(getKnownStaticContext())} value={selectedStaticVariables} onChange={onSelectedStaticVariablesChange}>
                                        </Select>
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