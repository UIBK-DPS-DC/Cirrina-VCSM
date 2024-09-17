import Action from "../../../classes/action.ts";
import React, {SetStateAction, useContext, useEffect, useRef, useState} from "react";
import {Button, Card, Col, Container, Form, ModalBody, Row,} from "react-bootstrap";
import {ActionCategory, ActionType} from "../../../enums.ts";
import {ReactFlowContext, renderEnumAsOptions} from "../../../utils.tsx";
import InvokeActionForm from "./invokeActionForm.tsx";
import CreateActionForm from "./createActionForm.tsx";
import AssignActionForm from "./assignActionForm.tsx";
import RaiseEventActionForm from "./raiseEventActionForm.tsx";
import TimeoutActionForm from "./timeoutActionForm.tsx";
import TimeoutResetActionForm from "./timeoutResetActionForm.tsx";
import Modal from "react-bootstrap/Modal";
import {isState, MatchActionProps, ReactFlowContextProps} from "../../../types.ts";
import MatchCase from "../../../classes/MatchCase.tsx";


let idCounter = 0

function CaseForm(props: {
    action: Action | undefined;
    setActions: React.Dispatch<SetStateAction<Action[]>>;
    onSubmit?: () => void;
    clearAfterSubmit?: boolean;

}) {


    const instanceId = useRef(++idCounter).current;
    let formCount = 0

    const formId = `${instanceId}-${formCount++}`

    useEffect(() => {
        console.log(`FORM ID : ${formId}`)
    }, []);
    const [action, setAction] = useState<Action | undefined>(undefined);

    const [invokeAction, setInvokeAction] = useState<Action[]>([]);
    const [createAction, setCreateAction] = useState<Action[]>([]);
    const [assignAction, setAssignAction] = useState<Action[]>([]);
    const [raiseEventAction, setRaiseEventAction] = useState<Action[]>([]);
    const [timeoutAction, setTimeoutAction] = useState<Action[]>([]);
    const [timeOutResetAction, setTimeoutResetAction] = useState<Action[]>([]);
    const [matchAction, setMatchAction] = useState<Action[]>([]);

    const [selectedActionType, setSelectedActionType] = useState<string>(ActionType.CREATE);

    const [caseInput, setCaseInput] = useState<string>(props.action?.case || "");

    const [caseIsValid, setCaseIsValid] = useState<boolean>(false);
    const [formIsValid, setFormIsValid] = useState<boolean>(false);
    const [actionIsValid, setActionIsValid] = useState<boolean>(false)

    // Validate case
    const validateCase = (expression: string) => {
        return !!expression.trim();
    };

    // Validate action based on selectedActionType
    const validateAction = () => {
        switch (selectedActionType) {
            case ActionType.INVOKE:
                return invokeAction.length === 1;
            case ActionType.CREATE:
                return createAction.length === 1;
            case ActionType.ASSIGN:
                return assignAction.length === 1;
            case ActionType.RAISE_EVENT:
                return raiseEventAction.length === 1;
            case ActionType.TIMEOUT:
                return timeoutAction.length === 1;
            case ActionType.TIMEOUT_RESET:
                return timeOutResetAction.length === 1;
            case ActionType.MATCH:
                return matchAction.length === 1;
            default:
                return false;
        }
    };

    const validateForm = (): boolean => {
       return actionIsValid && caseIsValid
    };

    const onActionSubmit = (newAction: Action) => {
        props.setActions((prevActions) => {
            const existingAction = prevActions.find((a) => a === newAction);
            if (existingAction) {
                existingAction.properties = newAction.properties;
                existingAction.type = newAction.type;
                existingAction.context = newAction.context;
                return [...prevActions];
            } else {
                return [...prevActions, newAction];
            }
        });
    };

    const onCaseInputChange = (event: React.ChangeEvent<HTMLInputElement>) => setCaseInput(event.currentTarget.value);

    const onSelectedActionTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedActionType(event.target.value);
    };

    useEffect(() => {
        setCaseIsValid(validateCase(caseInput));
        setFormIsValid(validateForm());
        switch (selectedActionType) {
            case ActionType.INVOKE:
                setAction(invokeAction[0]);
                break;
            case ActionType.CREATE:
                setAction(createAction[0]);
                break;
            case ActionType.ASSIGN:
                setAction(assignAction[0]);
                break;
            case ActionType.RAISE_EVENT:
                setAction(raiseEventAction[0]);
                break;
            case ActionType.TIMEOUT:
                setAction(timeoutAction[0]);
                break;
            case ActionType.TIMEOUT_RESET:
                setAction(timeOutResetAction[0]);
                break;
            case ActionType.MATCH:
                setAction(matchAction[0]);
                break;
            default:

        }
        validateAction()
    }, [caseInput, selectedActionType, invokeAction, createAction, assignAction, raiseEventAction, timeoutAction, timeOutResetAction, matchAction]);

    useEffect(() => {
        setCaseIsValid(validateCase(caseInput));  // Check if the case input is valid
        setActionIsValid(validateAction)
        setFormIsValid(validateForm());           // Check the overall form validity
    }, [caseInput, selectedActionType, invokeAction, createAction, assignAction, raiseEventAction, timeoutAction, timeOutResetAction, matchAction, caseIsValid, actionIsValid, formIsValid]);

    // Reset the form and action state
    useEffect(() => {
        if (props.action) {
            setAction(props.action);
            setSelectedActionType(props.action.type);
            setCaseInput(props.action.case || "");
        }
    }, [props.action]);

    const renderActionForm = () => {
        switch (selectedActionType) {
            case ActionType.INVOKE:
                return <InvokeActionForm action={props.action ? props.action : invokeAction[0]} setActions={props.action ? props.setActions : setInvokeAction} noCategorySelect={true} dontAddToState={true} />;
            case ActionType.CREATE:
                return <CreateActionForm action={props.action ? props.action : createAction[0]} setActions={props.action ? props.setActions : setCreateAction} noCategorySelect={true} dontAddToState={true}  />;
            case ActionType.ASSIGN:
                return <AssignActionForm action={props.action ? props.action : assignAction[0]} setActions={props.action ? props.setActions : setAssignAction} noCategorySelect={true} dontAddToState={true} />;
            case ActionType.RAISE_EVENT:
                return <RaiseEventActionForm action={props.action ? props.action : raiseEventAction[0]} setActions={props.action ? props.setActions : setRaiseEventAction} noCategorySelect={true} />;
            case ActionType.TIMEOUT:
                return <TimeoutActionForm action={props.action ? props.action : timeoutAction[0]} setActions={props.action ? props.setActions : setTimeoutAction} noCategorySelect={true} />;
            case ActionType.TIMEOUT_RESET:
                return <TimeoutResetActionForm action={props.action ? props.action : timeOutResetAction[0]} setActions={props.action ? props.setActions : setTimeoutResetAction} noCategorySelect={true} />;
            case ActionType.MATCH:
                return <MatchActionForm action={props.action ? props.action : matchAction[0]} setActions={props.action ? props.setActions : setMatchAction}  dontAddToState={true}/>;
            default:
                return null;
        }
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        console.log("I AM HERE")

        if (!action) {
            return;
        }

        action.case = caseInput;
        onActionSubmit(action);

        if (props.clearAfterSubmit) {
            resetForm();
        }

        if (props.onSubmit) {
            props.onSubmit();
        }
    };

    const resetForm = () => {
        setAction(undefined);
        setInvokeAction([]);
        setCreateAction([]);
        setAssignAction([]);
        setRaiseEventAction([]);
        setTimeoutAction([]);
        setTimeoutResetAction([]);
        setMatchAction([]);
        setCaseInput("");
        setSelectedActionType(ActionType.CREATE);
    };

    return (
        <Card>
            <Card.Header>{props.action ? "Edit Action" : "Create Action"}</Card.Header>
            <Card.Body>
                <Form className={"mb-3"} validated={formIsValid} id={formId} onSubmit={onSubmit}>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={"3"}>Case</Form.Label>
                        <Col sm={8}>
                            <Form.Control type={"text"} value={caseInput} isValid={caseIsValid} isInvalid={!caseIsValid} onChange={onCaseInputChange} />
                            <Form.Control.Feedback type={"invalid"}>Please provide a valid expression</Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className={"mb-3"}>
                        <Form.Label column sm={"3"}>Action Type: </Form.Label>
                        <Col sm={8}>
                            <Form.Select value={selectedActionType} onChange={onSelectedActionTypeChange} disabled={!!props.action}>
                                {renderEnumAsOptions(ActionType)}
                            </Form.Select>
                        </Col>
                    </Form.Group>
                </Form>
                <Container className={"mb-3"}>{renderActionForm()}</Container>
                <Container className={"align-content-center"}>
                    {!props.action && <Button variant={"primary"} type={"submit"} form={formId} disabled={!formIsValid}>Add Action</Button>}
                </Container>
            </Card.Body>
        </Card>
    );
}

export default function MatchActionForm(props: {
    action: Action | undefined,
    setActions: React.Dispatch<SetStateAction<Action[]>>,
    onSubmit?: () => void,
    noCategorySelect?: boolean
    dontAddToState? :boolean
    dontShowDeleteButton? : boolean

}) {

    const instanceId = useRef(++idCounter).current;
    let formCount = 0

    const formId = `${instanceId}-${formCount++}`
    const submitButtonText = () => props.action ? "Save Changes" : "Create Action"


    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const { selectedNode , actionService, stateOrStateMachineService} = context;

    const [expressionInput, setExpressionInput] = useState<string>("");
    const [caseActions, setCaseActions] = useState<Action[]>([]);
    const [selectedActionCategory, setSelectedActionCategory] = useState<string>(ActionCategory.ENTRY_ACTION);

    const [show, setShow] = useState<boolean>(false);

    const [expressionInputIsValid, setExpressionInputIsValid] = useState<boolean>(false);
    const [caseActionsAreValid, setCaseActionsAreValid] = useState<boolean>(false);
    const [formIsValid, setFormIsValid] = useState<boolean>(false);

    const handleShow = () => {
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
    };

    const onExpressionInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExpressionInput(event.currentTarget.value);
    };

    const onSelectedActionCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedActionCategory(event.target.value);
    };

    const validateExpressionInput = (expression: string) => {
        return !!expression.trim() && expression.length > 1;
    };

    const validateCaseActions = () => {
        return caseActions.length > 0;
    };

    const validateForm = () => {
        return expressionInputIsValid && caseActionsAreValid;
    };

    useEffect(() => {
        setExpressionInputIsValid(validateExpressionInput(expressionInput));
        setCaseActionsAreValid(validateCaseActions());
        setFormIsValid(validateForm());
    }, [expressionInput, caseActions, validateForm, caseActionsAreValid, formIsValid, caseActionsAreValid]);


    useEffect(() => {
            if(!selectedNode){
                return
            }
            if(props.action && props.action.type === ActionType.MATCH) {
                const matchActionProps = props.action.properties as MatchActionProps
                setExpressionInput(matchActionProps.value)
                const actions = matchActionProps.cases.map((mc) => mc.action)
                setCaseActions(actions)

                const actionCategory = actionService.getActionCategory(props.action,selectedNode.data)
                if(actionCategory) {
                    setSelectedActionCategory(actionCategory)
                }


            }
    }, [props.action, selectedActionCategory]);

    const onActionSubmit = (newAction: Action) => {
        props.setActions((prevActions) => {
            const existingAction = prevActions.find((a) => a === newAction);
            if (existingAction) {
                existingAction.properties = newAction.properties;
                existingAction.type = newAction.type;
                existingAction.context = newAction.context;
                return [...prevActions];
            } else {
                return [...prevActions, newAction];
            }
        });
    };

    const onDeleteButtonPress = () => {

        if(!selectedNode){
            return;
        }

        if(!props.action){
            return
        }

        stateOrStateMachineService.removeActionFromState(props.action, selectedNode.data)
        props.setActions((prevActions) => prevActions.filter((a) => a !== props.action))

    }



    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (!selectedNode || caseActions.length < 1) {
            return;
        }

        let matchCases: MatchCase[] = [];
        caseActions.forEach((a) => {
            if (!a.case) {
                console.error("Invalid action");
                return;
            }
            matchCases.push(new MatchCase(a.case, a));
            console.log(`Adding ${a.type} to match cases`)
        });

        const matchActionProps: MatchActionProps = {
            cases: matchCases,
            type: ActionType.MATCH,
            value: expressionInput,
        };

        let updatedAction: Action

        if (props.action && props.action.type === ActionType.MATCH) {

            const oldCategory = actionService.getActionCategory(props.action, selectedNode.data);

            // Check if category has changed and update the action in the state node if needed
            if (oldCategory !== selectedActionCategory as ActionCategory) {
                if(!props.dontAddToState){
                    stateOrStateMachineService.removeActionFromState(props.action, selectedNode.data);
                    stateOrStateMachineService.addActionToState(selectedNode.data, props.action, selectedActionCategory as ActionCategory);
                }
            }

            updatedAction = props.action;
            updatedAction.properties = matchActionProps;
            onActionSubmit(updatedAction);
        } else {
            updatedAction = new Action("", ActionType.MATCH);
            updatedAction.properties = matchActionProps;
            if(!props.dontAddToState){
                stateOrStateMachineService.addActionToState(selectedNode.data, updatedAction, selectedActionCategory as ActionCategory);
            }
            onActionSubmit(updatedAction);
        }

        if (props.onSubmit) {
            props.onSubmit();
        }

        actionService.deregisterAction(updatedAction);
        actionService.registerAction(updatedAction);


        if(isState(selectedNode.data)){
            const sm = selectedNode.data
            sm.state.entry.forEach(entry => {
                console.log(entry.properties)
            })
        }

        // Add logic for MatchAction submission if needed
    };

    return (
        <Card>
            <Card.Header>{props.action ? "Edit Match Action" : "Create new Match Action"}</Card.Header>
            <Card.Body>
                <Card.Title className={"text-center"}>Action properties</Card.Title>
                <Form className={"mb-3"} validated={formIsValid} id={formId} onSubmit={onSubmit}>
                    <Form.Group as={Row} controlId={"formExpression"} className={"mb-3"}>
                        <Form.Label column sm={"3"}>Expression: </Form.Label>
                        <Col sm={8}>
                            <Form.Control type={"text"} value={expressionInput} onChange={onExpressionInputChange} isValid={expressionInputIsValid} isInvalid={!expressionInputIsValid} />
                            <Form.Control.Feedback type={"invalid"}>Please enter a valid expression</Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group>
                        {!props.noCategorySelect && (
                            <Form.Group className={"mb-3"}>
                                <Form.Label>Action Category</Form.Label>
                                <Form.Select onChange={onSelectedActionCategoryChange} value={selectedActionCategory} className={"mb-3"}>
                                    {renderEnumAsOptions(ActionCategory)}
                                </Form.Select>
                            </Form.Group>
                        )}
                    </Form.Group>
                </Form>
                <Container className={"mb-3"}>
                    <Row>
                        <Col sm={6}>
                            <Button onClick={handleShow}>
                                Add Match Action
                                <i className="bi bi-plus-circle"></i>
                            </Button>
                        </Col>
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add Match Action</Modal.Title>
                            </Modal.Header>
                            <ModalBody>
                                <CaseForm action={undefined} setActions={setCaseActions} clearAfterSubmit={true} onSubmit={handleClose} />
                            </ModalBody>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                    </Row>
                </Container>
                <Container className={"mb-3"}>
                    {caseActions.length > 0 && caseActions.map((action) => (
                        <Card className={"mb-3"} key={`c-${action.id}`}>
                            <Card.Body>
                                <CaseForm key={`cf-${action.id}`} action={action} setActions={setCaseActions} />
                            </Card.Body>
                        </Card>
                    ))}
                </Container>

                {props.action && !props.dontShowDeleteButton && (
                    <Row className={"mb-3"}>
                        <Col sm={6}>
                            <Button type={"submit"} disabled={!formIsValid}>{submitButtonText()}</Button>
                        </Col>
                        <Col sm={6}>
                            <Button variant={"danger"} onClick={onDeleteButtonPress}>Delete</Button>
                        </Col>
                    </Row>
                ) || (
                    <Button type={"submit"} form={formId} disabled={!formIsValid}>
                        {submitButtonText()}
                    </Button>
                )}
            </Card.Body>
        </Card>
    );
}
