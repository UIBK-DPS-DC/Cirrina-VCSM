import React, {useContext, useEffect, useRef, useState} from "react";
import {ReactFlowContext, renderEnumAsOptions} from "../../utils.tsx";
import {ReactFlowContextProps} from "../../types.ts";
import Offcanvas from "react-bootstrap/Offcanvas";
import {
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
import Action from "../../classes/action.ts";
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


let idCounter = 0


export default function TransitionInfoForm() {
    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {selectedEdge, showSidebar, setShowSidebar,
    eventService, actionService} = context

    const instanceId = useRef(++idCounter).current;
    let formCount = 0

    const formId = `${instanceId}-${formCount++}`


    const [guardInput, setGuardInput] = useState<string>("")
    const [guardInputIsValid, setGuardInputIsValid] = useState<boolean>(false)
    const [guards, setGuards] = useState<Guard[]>(selectedEdge?.data?.transition.getGuards || []);
    const [actions, setActions] = useState<Action[]>(selectedEdge?.data?.transition.getActions || [])
    const [onEvent, setOnEvent] = useState<Event | undefined>()



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







    const onGuardInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGuardInput(event.target.value)
    }

    const onSelectedActionTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedActionType(event.target.value);
    };

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
            {showSidebar && selectedEdge && selectedEdge.data && (
                <Offcanvas show={showSidebar}
                           scroll={true} backdrop={false}
                           placement={"end"}
                           style={{ width: '30vw' }}>

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
                                    <SelectSingleEventModal event={onEvent} setEvent={setOnEvent}></SelectSingleEventModal>
                                </Col>
                            </Form.Group>

                        </Form>
                        {guards.length > 0 && (
                            <Container className={"mb-3"}>
                                <GuardDisplay guards={guards} setGuards={setGuards} onDelete={onGuardDelete} />
                            </Container>
                        )}

                        <Container className={"mb-3"}>
                            <Button onClick={handleShow}>
                                Add Action
                                <i className="bi bi-plus-circle"></i>
                            </Button>

                            <Modal show={showActionModal} size={"lg"} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Add Action</Modal.Title>
                                </Modal.Header>

                                <ModalBody>
                                    <Row className={"mb-3"}>
                                        <Form.Label column sm={"4"}>Action type:</Form.Label>
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

                        {selectedEdge.data.transition.getActions().map((actionType) => (<h2 key={actionType.id}>Hi ${actionType.id}</h2>))}

                    </OffcanvasBody>

                </Offcanvas>
            )}
        </>
    )




}