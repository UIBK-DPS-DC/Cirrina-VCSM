import React, {useCallback, useContext, useEffect, useState} from "react";
import { isState, ReactFlowContextProps} from "../../types.ts";
import Action from "../../classes/action.tsx";
import {ReactFlowContext, setInitialState, setStateAsTerminal} from "../../utils.tsx";
import RenameNodeComponent from "./renameNodeComponent.tsx";
import ActionDisplay from "../Action/actionDisplay.tsx";
import Offcanvas from 'react-bootstrap/Offcanvas';
import {
    Accordion, AccordionBody,
    AccordionHeader,
    AccordionItem,
    Button,
    Container,
    Form,
    OffcanvasBody,
    OffcanvasHeader
} from "react-bootstrap";
import CreateContextFormModal from "../Context/createContextFormModal.tsx";
import ActionAccordion from "../Action/actionAccordion.tsx";
import ContextVariable from "../../classes/contextVariable.tsx";
import ContextCardDisplay from "../Context/contextCardDisplay.tsx";

/**
 * NodeInfoForm Component
 *
 * This component renders a form that displays the properties of a selected node
 * and allows the user to update them. The form includes an input field for the
 * node name, which is pre-filled with the current name of the selected node.
 * Changes to the input field are reflected in the component state, and submitting
 * the form updates the node's name in the context.
 *
 * @component
 * @example
 * return (
 *   <NodeInfoForm />
 * )
 */
export default function NodeInfoForm() {
    const context: ReactFlowContextProps = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {
        selectedNode,
        stateOrStateMachineService,
        showSidebar,
        setShowSidebar,
        nodes,
        edges,
        initialOrTerminalChange,
        setInitialOrTerminalChange

    } = context;



    //######################################################################################################################################################################################################
    // TODO: Remove underscores once variables are used.
    const[showNewActionForm, setShowNewActionForm] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_invokeActions,setInvokeActions] = useState<Action[]>([]);
    const [_createActions, setCreateActions] = useState<Action[]>([]);
    const [_assignActions, setAssignActions] = useState<Action[]>([]);
    const [_raiseEventActions, setRaiseEventActions] = useState<Action[]>([]);
    const [_timeoutActions, setTimeoutActions] = useState<Action[]>([]);
    const [_timeoutResetActions, setTimeoutResetActions] = useState<Action[]>([]);
    const [_MatchActions, setMatchActions] = useState<Action[]>([]);
    const [_allAction,_setAllActions] = useState<Action[]>([]);


    const [localContext, setLocalContext] = useState<ContextVariable[]>([])
    const [staticContext, setStaticContext] = useState<ContextVariable[]>([])
    const [persistentContext, setPersistentContext] = useState<ContextVariable[]>([])



    const [isInitial,setIsInitial] = useState<boolean>(false)
    const [isTerminal, setIsTerminal] = useState<boolean>(false)






    // Handle checkbox change
    const handleInitialCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(!selectedNode){
            return
        }

        const checked = (event.target.checked);
        if(checked){
            setInitialState(selectedNode, nodes, edges)
            setIsTerminal(false)

        }
        else {
            if(isState(selectedNode.data)){
                selectedNode.data.state.initial = false

            }
        }
        setInitialOrTerminalChange(!initialOrTerminalChange)
        setIsInitial(checked)
    };

    const handleTerminalCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(!selectedNode){
            return
        }

        const checked = event.target.checked
        if(checked){
            setStateAsTerminal(selectedNode, edges)
            setIsInitial(false)
        }
        else{
            if(isState(selectedNode.data)){
                selectedNode.data.state.terminal = false
            }

        }
        setIsTerminal(checked)
        setInitialOrTerminalChange(!initialOrTerminalChange)
    }


    useEffect(() => {
        if(selectedNode && isState(selectedNode.data)){
            setIsInitial(selectedNode.data.state.initial)
            setIsTerminal(selectedNode.data.state.terminal)
            setLocalContext(selectedNode.data.state.localContext)
            setPersistentContext(selectedNode.data.state.persistentContext)
            setStaticContext(selectedNode.data.state.staticContext)

        }

    }, [selectedNode]);


    const onActionFormSubmit = () => {
        setShowNewActionForm(false)
    }

    const onNewActionFormButtonClick = useCallback((_: React.MouseEvent<HTMLButtonElement>) => {
        setShowNewActionForm(true)
        console.log("new action button clicked at", new Date().toISOString());
    },[])


    const onContextRemove = (variable: ContextVariable) => {
        if(selectedNode?.data && isState(selectedNode.data)) {
            selectedNode.data.state.removeContext(variable)
        }
    }


    const renderContexts = useCallback(() => {
        if(selectedNode && isState(selectedNode.data)){
           return(
            <Container className={"mb-3"}>
                    <ContextCardDisplay vars={localContext} headerText={"Local Context"} setVars={setLocalContext} deregisterOnRemove={true} onRemove={onContextRemove} />
                    <ContextCardDisplay vars={staticContext} headerText={"Static Context"} setVars={setStaticContext} deregisterOnRemove={true} onRemove={onContextRemove} />
                    <ContextCardDisplay vars={staticContext} headerText={"Persistent Context"} setVars={setPersistentContext} deregisterOnRemove={true} onRemove={onContextRemove} />
            </Container>
           )
        }
    },[selectedNode, localContext, persistentContext, staticContext, setLocalContext, setStaticContext, setPersistentContext, selectedNode?.data])





    return (
        selectedNode && (
            <div >
                <Offcanvas show={showSidebar} scroll={true} backdrop={false} placement={"end"} style={{ width: '30vw' }} data-bs-theme="dark">
                    <OffcanvasHeader closeButton={true} onClick={() => {setShowSidebar(false)}}>
                        <Offcanvas.Title>{stateOrStateMachineService.getName(selectedNode.data)}</Offcanvas.Title>
                    </OffcanvasHeader>
                    <OffcanvasBody>
                        <RenameNodeComponent/>
                        <br/>
                        {isState(selectedNode.data) && (
                            <Container>
                                <Container className={"mb-3"}>
                                    <CreateContextFormModal variable={undefined} buttonName={undefined} onSubmit={undefined}></CreateContextFormModal>
                                </Container>

                                {/** Initial terminal checkboxes*/}

                                <Container className={"mb-3"}>
                                    <Form id={"checkboxes"}>

                                        <Form.Group className={"mb-3"}>
                                            <Form.Check type={"checkbox"} label={"Initial"} checked={isInitial} onChange={handleInitialCheckboxChange}/>
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Check type={"checkbox"} label={"Terminal"} checked={isTerminal} onChange={handleTerminalCheckboxChange}/>
                                        </Form.Group>

                                    </Form>
                                </Container>

                                <br/>
                                <Container>
                                    <div className="d-grid gap-2 mb-3">
                                        <Button variant="primary" size="lg" onClick={onNewActionFormButtonClick}>
                                            New Action
                                        </Button>
                                    </div>
                                    {showNewActionForm && (
                                        <div className={"action-form-container"}>
                                            <ActionDisplay action={undefined}
                                                           setInvokeActions={setInvokeActions}
                                                           onSubmit={onActionFormSubmit}
                                                           setCreateActions={setCreateActions}
                                                           setAssignActions={setAssignActions}
                                                           setRaiseEventActions={setRaiseEventActions}
                                                           setTimeoutActions={setTimeoutActions}
                                                           setTimeoutResetActions={setTimeoutResetActions}
                                                           setMatchActions={setMatchActions}
                                            ></ActionDisplay>
                                        </div>
                                    )}
                                </Container>

                                <div>
                                    {renderContexts()}
                                </div>

                                <div>




                                    {isState(selectedNode.data) && selectedNode.data.state.entry && (
                                        <ActionAccordion headerText={"Entry Actions"}
                                                         actions={selectedNode.data.state.entry}
                                                         setInvokeActions={setInvokeActions}
                                                         setCreateActions={setCreateActions}
                                                         setAssignActions={setAssignActions}
                                                         setRaiseEventActions={setRaiseEventActions}
                                                         setTimeoutActions={setTimeoutActions}
                                                         setTimeoutResetActions={setTimeoutResetActions}
                                                         setMatchActions={setMatchActions}
                                        />
                                    )
                                    }

                                    {isState(selectedNode.data) && selectedNode.data.state.exit && (
                                        <ActionAccordion headerText={"Exit Actions"}
                                                         actions={selectedNode.data.state.exit}
                                                         setInvokeActions={setInvokeActions}
                                                         setCreateActions={setCreateActions}
                                                         setAssignActions={setAssignActions}
                                                         setRaiseEventActions={setRaiseEventActions}
                                                         setTimeoutActions={setTimeoutActions}
                                                         setTimeoutResetActions={setTimeoutResetActions}
                                                         setMatchActions={setMatchActions}
                                        />
                                    )
                                    }

                                    {isState(selectedNode.data) && selectedNode.data.state.while && (
                                        <ActionAccordion headerText={"While Actions"}
                                                         actions={selectedNode.data.state.while}
                                                         setInvokeActions={setInvokeActions}
                                                         setCreateActions={setCreateActions}
                                                         setAssignActions={setAssignActions}
                                                         setRaiseEventActions={setRaiseEventActions}
                                                         setTimeoutActions={setTimeoutActions}
                                                         setTimeoutResetActions={setTimeoutResetActions}
                                                         setMatchActions={setMatchActions}
                                        />
                                    )
                                    }

                                    {isState(selectedNode.data) && selectedNode.data.state.after && (
                                        <ActionAccordion headerText={"Timeout Actions"}
                                                         actions={selectedNode.data.state.after}
                                                         setInvokeActions={setInvokeActions}
                                                         setCreateActions={setCreateActions}
                                                         setAssignActions={setAssignActions}
                                                         setRaiseEventActions={setRaiseEventActions}
                                                         setTimeoutActions={setTimeoutActions}
                                                         setTimeoutResetActions={setTimeoutResetActions}
                                                         setMatchActions={setMatchActions}
                                        />
                                    )
                                    }

                                </div>
                            </Container>
                        )}
                    </OffcanvasBody>
                </Offcanvas>
            </div>
        )
    )

}
