import React, {useCallback, useContext, useEffect, useState} from "react";
import {isState, isStateMachine, ReactFlowContextProps} from "../../types.ts";
import Action from "../../classes/action.tsx";
import {ReactFlowContext, setInitialState, setStateAsTerminal} from "../../utils.tsx";
import RenameNodeComponent from "./renameNodeComponent.tsx";
import ActionDisplay from "../Action/actionDisplay.tsx";
import Offcanvas from 'react-bootstrap/Offcanvas';
import {
    Button,
    Container,
    Form, ModalBody,
    OffcanvasBody,
    OffcanvasHeader
} from "react-bootstrap";
import CreateContextFormModal from "../Context/createContextFormModal.tsx";
import ActionAccordion from "../Action/actionAccordion.tsx";
import ContextVariable from "../../classes/contextVariable.tsx";
import ContextCardDisplay from "../Context/contextCardDisplay.tsx";
import Modal from "react-bootstrap/Modal";

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
        setInitialOrTerminalChange,
        darkMode

    } = context;



    //######################################################################################################################################################################################################
    // TODO: Remove underscores once variables are used.
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
    const [submitted, setSubmitted] = useState<boolean>(false)


    const [show, setShow] = useState(false);


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);





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
        if(selectedNode && isStateMachine(selectedNode.data)){
            setPersistentContext(selectedNode.data.stateMachine.persistentContext)
            setLocalContext(selectedNode.data.stateMachine.localContext)
        }

    }, [selectedNode, localContext, staticContext, persistentContext, setPersistentContext, setLocalContext, setStaticContext,submitted]);


    const onActionFormSubmit = () => {
        handleClose()
    }

    const onNewActionFormButtonClick = useCallback((_: React.MouseEvent<HTMLButtonElement>) => {
        handleShow()
        console.log("new action button clicked at", new Date().toISOString());
    },[])


    const onContextRemove = (variable: ContextVariable) => {
        if(selectedNode?.data && isState(selectedNode.data)) {
            selectedNode.data.state.removeContext(variable)
        }
        if(selectedNode?.data && isStateMachine(selectedNode.data)) {
            selectedNode.data.stateMachine.removeContext(variable)
        }

    }


    const renderContexts = useCallback(() => {
        if(selectedNode){
           return(<div className={"mb-3"}>
                   <ContextCardDisplay vars={localContext} headerText={"Local Context"} setVars={setLocalContext} deregisterOnRemove={true} onRemove={onContextRemove} />
                   <ContextCardDisplay vars={persistentContext} headerText={"Persistent Context"} setVars={setPersistentContext} deregisterOnRemove={true} onRemove={onContextRemove} />
                   {/** Static context does not exist on statemachines*/}
                   {isState(selectedNode.data) && (
                       <ContextCardDisplay vars={staticContext} headerText={"Static Context"} setVars={setStaticContext} deregisterOnRemove={true} onRemove={onContextRemove} />
           )}
           </div>
           )
        }
    },[selectedNode, localContext, persistentContext, staticContext, setLocalContext, setStaticContext, setPersistentContext, selectedNode?.data,submitted])





    return (
        selectedNode && (
            <div >
                <Offcanvas show={showSidebar} scroll={true} backdrop={false} placement={"end"} style={{ width: '30vw' }}
                           data-bs-theme={darkMode ? "dark" : "light"}>
                    <OffcanvasHeader closeButton={true} onClick={() => {setShowSidebar(false)}}>
                        <Offcanvas.Title>{stateOrStateMachineService.getName(selectedNode.data)}</Offcanvas.Title>
                    </OffcanvasHeader>
                    <OffcanvasBody>
                        <RenameNodeComponent/>
                        <br/>
                        {isState(selectedNode.data) && (
                            <Container>


                                {/** Initial terminal checkboxes*/}

                                <div className={"mb-5"}>
                                    <Form id={"checkboxes"}>

                                        <Form.Group className={"mb-3"}>
                                            <Form.Check type={"checkbox"} label={"Initial"} checked={isInitial}
                                                        onChange={handleInitialCheckboxChange}/>
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Check type={"checkbox"} label={"Terminal"} checked={isTerminal}
                                                        onChange={handleTerminalCheckboxChange}/>
                                        </Form.Group>

                                    </Form>
                                </div>


                                <div className={"mb-5"}>

                                    <div>
                                        <Button variant="primary" onClick={onNewActionFormButtonClick}>
                                            Add Action to State
                                        </Button>
                                    </div>
                                    <br/>
                                    <Container>
                                        <Modal show={show} onHide={handleClose} backdrop={"static"} size="lg" centered
                                               data-bs-theme={darkMode ? "dark" : "light"}>
                                            <Modal.Header closeButton={true}>
                                                <Modal.Title style={{color: darkMode ? "#ffffff" : "#000000"}}>Create
                                                    Action</Modal.Title>
                                            </Modal.Header>

                                            <ModalBody>
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
                                            </ModalBody>

                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={handleClose}>
                                                    Close
                                                </Button>
                                            </Modal.Footer>

                                        </Modal>
                                    </Container>


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
                        <div className={"mb-3"}>
                            <CreateContextFormModal variable={undefined} buttonName={"Add Context Variable"}
                                                    onSubmit={() => setSubmitted(!submitted)}></CreateContextFormModal>
                        </div>
                        {renderContexts()}
                    </OffcanvasBody>
                </Offcanvas>
            </div>
        )
    )

}
