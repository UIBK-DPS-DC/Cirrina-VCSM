import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {generateRaisedToConsumedInfoStrings, ReactFlowContext, renderEnumAsOptions} from "../../utils.tsx";
import {CsmEdgeProps, CsmNodeProps, isState, isStateMachine, ReactFlowContextProps} from "../../types.ts";
import Offcanvas from "react-bootstrap/Offcanvas";
import {
    Accordion, AccordionHeader,
    Button,
    Col,
    Container,
    Form,
    InputGroup, ModalBody,
    OffcanvasBody,
    OffcanvasHeader,
    OffcanvasTitle,
    Row
} from "react-bootstrap";
import Guard from "../../classes/guard.tsx";
import GuardDisplay from "../Guard/guardDisplay.tsx";
import Action from "../../classes/action.tsx";
import Event from "../../classes/event.ts";
import SelectSingleEventModal from "../Event/selectSingleEventModal.tsx";
import {ActionType} from "../../enums.ts";
import InvokeActionForm from "./ActionForms/invokeActionForm.tsx";
import CreateActionForm from "./ActionForms/createActionForm.tsx";
import AssignActionForm from "./ActionForms/assignActionForm.tsx";
import RaiseEventActionForm from "./ActionForms/raiseEventActionForm.tsx";
import TimeoutActionForm from "./ActionForms/timeoutActionForm.tsx";
import TimeoutResetActionForm from "./ActionForms/timeoutResetActionForm.tsx";
import MatchActionForm from "./ActionForms/matchActionForm.tsx";
import Modal from "react-bootstrap/Modal";
import {addEdge, Connection, Edge, MarkerType, Node} from "@xyflow/react";
import {getNewEdgeId} from "./flow.tsx";



let idCounter = 0
const NO_ELSE = "NO_ELSE";


export default function TransitionInfoForm() {
    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {selectedEdge,
        showSidebar,
        setShowSidebar,
        eventService,
        setRecalculateTransitions,
        recalculateTransitions,
        nodes,
        setEdges,
        edges,
        transitionService, darkMode} = context

    const instanceId = useRef(++idCounter).current;
    let formCount = 0

    const formId = `${instanceId}-${formCount++}`


    const [guardInput, setGuardInput] = useState<string>("")
    const [guardInputIsValid, setGuardInputIsValid] = useState<boolean>(false)
    const [guards, setGuards] = useState<Guard[]>(selectedEdge?.data?.transition.getGuards || []);
    const [actions, setActions] = useState<Action[]>(selectedEdge?.data?.transition.getActions || [])
    const [onEvent, setOnEvent] = useState<Event | undefined>()
    const [selectedElse, setSelectedElse] = useState<string>(selectedEdge?.data?.transition.getElse() || NO_ELSE)



    const [invokeAction, setInvokeAction] = useState<Action[]>([]);
    const [createAction, setCreateAction] = useState<Action[]>([]);
    const [assignAction, setAssignAction] = useState<Action[]>([]);
    const [raiseEventAction, setRaiseEventAction] = useState<Action[]>([]);
    const [timeoutAction, setTimeoutAction] = useState<Action[]>([]);
    const [timeOutResetAction, setTimeoutResetAction] = useState<Action[]>([]);
    const [matchAction, setMatchAction] = useState<Action[]>([]);
    const [selectedActionType, setSelectedActionType] = useState<string>(ActionType.CREATE);


    const [showActionModal, setShowActionModal] = useState<boolean>(false)

    const handleShow = () => setShowActionModal(true)
    const handleClose = () => setShowActionModal(false)

    const siblings = useCallback(() => {
        if(!selectedEdge?.data){
            return
        }

        const source = nodes.find((n) => n.id === selectedEdge.source)
        if(!source){
            return
        }

        return nodes.filter((n) => n.parentId === source.parentId && isState(n.data))

    },[nodes, selectedEdge])

    const onInvokeActionSubmit = () => {
        setActions((prev) => [...prev, invokeAction[0]])
        setInvokeAction([])
        handleClose()
    }

    const onCreateActionSubmit = () => {
        setActions((prev) => [...prev, createAction[0]])
        setCreateAction([])
        handleClose()

    }

    const onAssignActionSubmit = () => {
        setActions((prev) => [...prev,assignAction[0]])
        setAssignAction([])
        handleClose()
    }


    const onRaiseEventActionSubmit = () => {
        setActions((prev) => [...prev, raiseEventAction[0]])
        setRaiseEventAction([])
        handleClose()
    }

    const onTimeoutActionSubmit = () => {
        setActions((prev) => [...prev, timeoutAction[0]])
        setTimeoutAction([])
        handleClose()
    }

    const onTimeoutResetActionSubmit = () => {
        setActions((prev) => [...prev, timeOutResetAction[0]])
        setTimeoutResetAction([])
        handleClose()
    }

    const onMatchActionSubmit = () => {
        setActions((prev) => [...prev, matchAction[0]])
        setMatchAction([])
        handleClose()
    }

    const getAllDescendants = (node: Node<CsmNodeProps>, nodes: Node<CsmNodeProps>[]) => {
        const children = nodes.filter((n: Node<CsmNodeProps>) => n.parentId === node.id);

        children.forEach((n: Node<CsmNodeProps>) => {
            if (isStateMachine(n.data)) {
                const descendants = getAllDescendants(n, nodes);
                children.push(...descendants);
            }
        });

        return children;
    }

    const generateInfoStrings = useCallback((nodes: Node<CsmNodeProps>[]) => {
        if(!selectedEdge?.data){
            return []
        }
        if(!selectedEdge.data.transition.isStatemachineEdge){
            return []
        }

        const sourceNode = nodes.find((n) => n.id === selectedEdge.source)
        const targetNode = nodes.find((n) => n.id === selectedEdge.target)

        if(!sourceNode || !targetNode){
            return []
        }

        const localNodes = getAllDescendants(sourceNode, nodes).concat(getAllDescendants(targetNode,nodes))

        return generateRaisedToConsumedInfoStrings(localNodes)



    },[recalculateTransitions, setRecalculateTransitions])












    const renderActionForm = () => {
        switch (selectedActionType) {
            case ActionType.INVOKE:
                return <InvokeActionForm action={invokeAction[0]} setActions={setInvokeAction} noCategorySelect={true} dontAddToState={false} onSubmit={onInvokeActionSubmit}/>;
            case ActionType.CREATE:
                return <CreateActionForm action={createAction[0]} setActions={setCreateAction} noCategorySelect={true} dontAddToState={false} onSubmit={onCreateActionSubmit}  />;
            case ActionType.ASSIGN:
                return <AssignActionForm action={assignAction[0]} setActions={ setAssignAction} noCategorySelect={true} dontAddToState={false} onSubmit={onAssignActionSubmit} />;
            case ActionType.RAISE_EVENT:
                return <RaiseEventActionForm action={raiseEventAction[0]} setActions={setRaiseEventAction} noCategorySelect={true} dontAddToEdge={false} onSubmit={onRaiseEventActionSubmit}/>;
            case ActionType.TIMEOUT:
                return <TimeoutActionForm action={timeoutAction[0]} setActions={setTimeoutAction} noCategorySelect={true} onSubmit={onTimeoutActionSubmit}/>;
            case ActionType.TIMEOUT_RESET:
                return <TimeoutResetActionForm action={timeOutResetAction[0]} setActions={setTimeoutResetAction} noCategorySelect={true} onSubmit={onTimeoutResetActionSubmit}/>;
            case ActionType.MATCH:
                return <MatchActionForm action={undefined} setActions={setMatchAction}  dontAddToState={false} onSubmit={onMatchActionSubmit}/>;
            default:
                return null;
        }
    };


    const offcanvasTitle = () => selectedEdge?.data?.transition ?
        selectedEdge.data.transition.getSource() + " => " + selectedEdge.data.transition.getTarget() : "Unknown"

    const invalidGuardInputText = () => "Please provide a valid expression"

    const validateGuardInput = (guardExpression: string) => {
        // TODO: Guard verification logic
        return !!guardExpression.trim()
    }

    const onGuardDelete = (guard: Guard) => {
        if(selectedEdge?.data?.transition) {
            selectedEdge.data.transition.removeGuard(guard)
        }
    }

    const onEventClear = () => {
        if(selectedEdge?.data?.transition) {
            selectedEdge.data.transition.setEvent("")
        }
    }




    useEffect(() => {
        if(selectedEdge?.data && onEvent){
            selectedEdge.data.transition.setEvent(onEvent.name)
        }
        setRecalculateTransitions(!recalculateTransitions)
    }, [onEvent]);

    useEffect(() => {
        if(selectedEdge?.data){
            const eventToBeSet = eventService.getEventByName(selectedEdge.data.transition.getEvent())
            if(eventToBeSet){
                setOnEvent(eventToBeSet)
            }
            else {
                setOnEvent(undefined)
            }

            setGuards(selectedEdge.data.transition.getGuards())

            setActions(selectedEdge.data.transition.getActions())

            if(!selectedEdge.data.transition.getElse().trim()){
                setSelectedElse(NO_ELSE)
            }
            else {
                setSelectedElse(selectedEdge.data.transition.getElse())
            }

        }
        setRecalculateTransitions(!recalculateTransitions)

    }, [selectedEdge, selectedEdge?.data]);


    const onGuardInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGuardInput(event.target.value)
    }

    const onSelectedActionTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedActionType(event.target.value);
    };

    const onSelectedElseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedElse(event.target.value);
        if(!selectedEdge?.data){
            return
        }
        if(event.target.value === NO_ELSE){
            selectedEdge.data.transition.setElse("")
        }
        else{
            selectedEdge.data.transition.setElse(event.target.value)
        }

        const prevEdge = edges.find((e) => e.data?.elseEdge && e.source ===  selectedEdge.source)
        setEdges((prev) => prev.filter(e => e !== prevEdge))

        const sourceNode = nodes.find((n) => n.id === selectedEdge.source)
        if(!sourceNode){
            return
        }

        const targetNode = nodes.find((n) => n.parentId === sourceNode.parentId && isState(n.data) && n.data.state.name === event.target.value)
        if(!targetNode){
            return
        }


        if(event.target.value !== NO_ELSE){
            const connection: Connection = {
                source: selectedEdge.source, sourceHandle: selectedEdge.sourceHandle || "t-s", target: targetNode.id, targetHandle: "b-t"

            }
            const newTransition = transitionService.connectionToTransition(connection);
            if (newTransition) {
                newTransition.isElseEdge = true
                newTransition.elseSourceId = selectedEdge.data.transition.getId()
                const edge: Edge<CsmEdgeProps> = { id: getNewEdgeId(),
                    ...connection,
                    type: 'csm-edge',
                    data: { transition: newTransition, elseEdge: true }, zIndex: 1, markerEnd: {type: MarkerType.ArrowClosed}, selectable: false
                };

                setEdges(eds => addEdge(edge, eds));
            }
        }


    }

    const onAddGuardClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        event.stopPropagation()

        if(!selectedEdge?.data?.transition){
            return
        }


        const newGuard = new Guard(guardInput)
        selectedEdge.data.transition.addGuard(newGuard)
        setGuards((prevGuards) => [...prevGuards, newGuard])
        setGuardInput("")


    }


    useEffect(() => {
        setGuardInputIsValid(validateGuardInput(guardInput))
    }, [guardInput]);



    return (
        <>
            {showSidebar && selectedEdge && selectedEdge.data && !selectedEdge.data.transition.isElseEdge && (
                <Offcanvas show={showSidebar}
                           scroll={true} backdrop={false}
                           placement={"end"}
                           style={{ width: '30vw' }}
                           data-bs-theme={darkMode ? "dark" : "light"}>

                    <OffcanvasHeader closeButton={true} onClick={() => {setShowSidebar(false)}}>
                        <OffcanvasTitle>
                            {offcanvasTitle()}
                        </OffcanvasTitle>
                    </OffcanvasHeader>

                    <OffcanvasBody>
                        <Form id={formId}>

                            <Form.Group as={Row} className={"mb-3"}>
                                <Form.Label column sm={"2"}>Source State: </Form.Label>
                                <Col sm={10}>
                                    <Form.Control type={"text"}
                                                  disabled={true}
                                                  value={selectedEdge.data.transition.getSource()}
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className={"mb-3"}>
                                <Form.Label column sm={"2"}>Target State: </Form.Label>
                                <Col sm={10}>
                                    <Form.Control type={"text"}
                                                  disabled={true}
                                                  value={selectedEdge.data.transition.getTarget()}
                                    />
                                </Col>
                            </Form.Group>

                            {selectedEdge.data.transition.isStatemachineEdge && (
                                <Container>
                                    {generateInfoStrings(nodes).map((s) => {
                                        return (
                                            <p>{s}</p>
                                        )
                                    })}
                                </Container>
                            )}

                            {! selectedEdge.data.transition.isStatemachineEdge && (
                                <Container>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column sm={"2"}>
                                            Add Guard:
                                        </Form.Label>
                                        <Col sm={10}>
                                            <InputGroup>
                                                <Form.Control type={"text"} value={guardInput} onChange={onGuardInputChange} isValid={guardInputIsValid} isInvalid={!guardInputIsValid && guardInput !== ""}/>
                                                <Button disabled={!guardInputIsValid} onClick={onAddGuardClick}>
                                                    Add
                                                    <i className={"bi bi-plus-circle"}></i>
                                                </Button>
                                                <Form.Control.Feedback type={"invalid"}>
                                                    {invalidGuardInputText()}
                                                </Form.Control.Feedback>
                                            </InputGroup>
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className={"mb-3"}>
                                        <Form.Label column sm={"2"}>
                                            On:
                                        </Form.Label>
                                        {onEvent && (
                                            <Col sm={5}>
                                                <Form.Control type={"text"} value={onEvent.name} disabled={true}/>
                                            </Col>
                                        )}
                                        <Col sm={onEvent ? 5 : 10}>
                                            <SelectSingleEventModal event={onEvent} setEvent={setOnEvent} onClear={onEventClear}></SelectSingleEventModal>
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className={"mb-3"}>
                                        <Form.Label column sm={"2"}>
                                            Else:
                                        </Form.Label>
                                        <Col sm={10}>
                                            <Form.Select value={selectedElse} onChange={onSelectedElseChange}>
                                                <option value={NO_ELSE}>None</option>
                                                {siblings()?.map((s) => {
                                                    return (
                                                        <option value={isState(s.data) ? s.data.state.name : s.id} key={`o-${s.id}`}>{isState(s.data) ? s.data.state.name : s.id}</option>
                                                    )
                                                })}
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>
                                </Container>
                            )}

                        </Form>
                        {guards.length > 0 && (
                            <Container className={"mb-3"}>
                                <GuardDisplay guards={guards} setGuards={setGuards} onDelete={onGuardDelete} />
                            </Container>
                        )}

                        {! selectedEdge.data.transition.isStatemachineEdge && (
                            <Container className={"mb-3"}>
                                <Row>
                                    <Col sm={6}>
                                        Transition Actions:
                                    </Col>
                                    <Col sm={6}>
                                        <Button onClick={handleShow}>
                                            Add Action
                                            <i className="bi bi-plus-circle"></i>
                                        </Button>
                                    </Col>
                                </Row>

                                <Modal show={showActionModal} size={"lg"} onHide={handleClose} data-bs-theme={darkMode ? "dark" : "light"} >
                                    <Modal.Header closeButton>
                                        <Modal.Title style={{color: darkMode ? "#ffffff" : "#000000"}}>Add Action</Modal.Title>
                                    </Modal.Header>

                                    <ModalBody>
                                        <Row className={"mb-3"}>
                                            <Form.Label column sm={"4"} style={{color: darkMode ? "#ffffff" : "#000000"}} >Action type:</Form.Label>
                                            <Col sm={8}>
                                                <Form.Select value={selectedActionType} onChange={onSelectedActionTypeChange}>
                                                    {renderEnumAsOptions(ActionType)}
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                        {renderActionForm()}
                                    </ModalBody>

                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                                    </Modal.Footer>

                                </Modal>
                            </Container>
                        )}
                        {actions.length > 0 && (
                            <Accordion>
                                <Accordion.Item eventKey={"0"}>
                                    <AccordionHeader>
                                        On Actions
                                    </AccordionHeader>
                                    <Accordion.Body>
                                        {selectedEdge.data.transition.getActions().map((a) => {
                                            switch (a.type) {
                                                case ActionType.CREATE: {
                                                    return (
                                                        <Container className={"mb-3"} key={a.id}>
                                                            <CreateActionForm action={a} setActions={setCreateAction} onSubmit={onCreateActionSubmit} noCategorySelect={true} />
                                                        </Container>
                                                    )
                                                }
                                                case ActionType.ASSIGN: {
                                                    return(
                                                        <Container className={"mb-3"} key={a.id}>
                                                            <AssignActionForm action={a} setActions={setAssignAction} onSubmit={onAssignActionSubmit} noCategorySelect={true}/>
                                                        </Container>
                                                    )
                                                }
                                                case ActionType.RAISE_EVENT: {
                                                    return (
                                                        <Container className={"mb-3"} key={a.id}>
                                                            <RaiseEventActionForm action={a} setActions={setRaiseEventAction} onSubmit={onRaiseEventActionSubmit} noCategorySelect={true}/>
                                                        </Container>
                                                    )
                                                }
                                                case ActionType.TIMEOUT: {
                                                    return (
                                                        <Container className={"mb-3"} key={a.id}>
                                                            <TimeoutActionForm action={a} setActions={setTimeoutAction} onSubmit={onTimeoutActionSubmit} noCategorySelect={true} />
                                                        </Container>
                                                    )
                                                }

                                                case ActionType.TIMEOUT_RESET: {
                                                    return(
                                                        <Container className={"mb-3"} key={a.id}>
                                                            <TimeoutResetActionForm action={a} setActions={setTimeoutResetAction} onSubmit={onTimeoutResetActionSubmit} noCategorySelect={true}/>
                                                        </Container>
                                                    )
                                                }
                                                case ActionType.INVOKE: {
                                                    return (
                                                        <Container className={"mb-3"} key={a.id}>
                                                            <InvokeActionForm action={a} setActions={setInvokeAction} onSubmit={onInvokeActionSubmit} noCategorySelect={true}/>
                                                        </Container>
                                                    )
                                                }
                                                case ActionType.MATCH: {
                                                    return (
                                                        <Container className={"mb-3"} key={a.id}>
                                                            <MatchActionForm action={a} setActions={setMatchAction} onSubmit={onMatchActionSubmit} noCategorySelect={true}/>
                                                        </Container>
                                                    )
                                                }
                                                default: {
                                                    return <></>
                                                }
                                            }
                                        })}
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        )}
                    </OffcanvasBody>

                </Offcanvas>
            )}
        </>
    )




}