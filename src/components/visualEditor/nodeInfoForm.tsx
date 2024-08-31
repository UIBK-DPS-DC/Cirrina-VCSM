import React, {useCallback, useContext, useEffect, useState} from "react";
import { CsmNodeProps, isState, isStateMachine, ReactFlowContextProps} from "../../types.ts";
import {ActionCategory, ActionType, MemoryUnit, ServiceLevel, ServiceType, TimeUnit} from "../../enums.ts";
import Action from "../../classes/action.ts";
import {ReactFlowContext} from "../../utils.tsx";
import RenameNodeComponent from "./renameNodeComponent.tsx";
import {renderEnumAsOptions} from "../../utils.tsx";
import ActionDisplay from "./ActionForms/actionDisplay.tsx";
import Offcanvas from 'react-bootstrap/Offcanvas';
import {Button, Container, OffcanvasBody, OffcanvasHeader} from "react-bootstrap";
import ContextModal from "../Context/contextModal.tsx";

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
        nodes,
        setNodes,
        selectedNode,
        stateOrStateMachineService,
        showSidebar,
        setShowSidebar,
        setNameInput,
        setEdges,
        actionService,
        eventService,
        contextService
    } = context;


    const [selectedActionType, setSelectedActionType] = useState<string>("no-new-action")
    const [selectedActionCategory, setSelectedActionCategory] = useState<string>(ActionCategory.WHILE_ACTION)
    const [selectedServiceType, setSelectedServiceType] = useState<string>(ServiceType.LOCAL)
    const [selectedServiceLevel, setSelectedServiceLevel] = useState<string>(ServiceLevel.GLOBAL)
    const [raiseEventSelectedType, setRaiseEventSelectedType] = useState<string>("new-raise-event")
    const [newEventName, setNewEventName] = useState<string>("New Event Name")
    const [newActionName, setNewActionName] = useState<string>("New Action Name")
    const [invokeDescriptionInput, setInvokeDescriptionInput] = useState<string>("")
    const [invokeDurationValueInput, setInvokeDurationValueInput] = useState<string>("")
    const [invokeMemoryValueInput, setInvokeMemoryValueInput] = useState<string>("")
    const [invokeCpuUtilizationInput, setInvokeCpuUtilizationInput] = useState<number | string>("")
    const [selectedTimeUnit, setSelectedTimeUnit] = useState<string>("ms")
    const [selectedMemoryUnit, setSelectedMemoryUnit] = useState<string>("KB")
    const [createDescriptionInput, setCreateDescriptionInput] = useState<string>("")
    const [createVariableNameInput, setCreateVariableInput] = useState<string>("")
    const [createVariableValueInput, setCreateVariableValueInput] = useState<string>("")
    const [isPersistentCheckbox, setIsPersistentCheckbox] = useState<boolean>(false);
    const [selectedContextVariable, setSelectedContextVariable] = useState<string>("");
    const [assignActionValueInput, setAssignActionValueInput] = useState<string>("")
    const [delayValueInput, setDelayValueInput] = useState<string | number>("")
    const [selectedExistingAction, setSelectedExistingAction] = useState<string>("")
    const [saveAsNamedActionCheckbox, setSaveAsNamedActionCheckbox] = useState<boolean>(false);


    const[showNewActionForm, setShowNewActionForm] = useState(false);




    /**
     * useEffect hook to update the name input field when the selected node changes.
     */
    useEffect(() => {
        if (selectedNode) {
            setNameInput(stateOrStateMachineService.getName(selectedNode.data));
        }
    }, [selectedNode, setNameInput, stateOrStateMachineService]);


    //################################## For logging #####################################
    // These exist for logging and debugging purposes, can be deleted later.
    useEffect(() => {
        if(selectedActionType){
            console.log(`Selected Action type changed to ${selectedActionType}`);
        }
    }, [selectedActionType]);

    useEffect(() => {
        console.log(`Selected Service Type changed to ${selectedServiceType}`);
    }, [selectedServiceType]);

    useEffect(() => {
        console.log(`Selected Service Level changed to ${selectedServiceLevel}`);
    }, [selectedServiceLevel]);

    useEffect(() => {
        console.log(`Is Persistent Checkbox changed to ${isPersistentCheckbox}`);
    }, [isPersistentCheckbox]);

    useEffect(() => {
        console.log(`Selected Context Variable changed to ${selectedContextVariable}`)
    }, [selectedContextVariable]);

    useEffect(() => {
        console.log(`Selected Time Unit changed to ${selectedTimeUnit}`);
    },[selectedTimeUnit]);

    useEffect(() => {
        console.log(`Selected Memory Unit changed to ${selectedMemoryUnit}`)
    },[selectedMemoryUnit]);

    useEffect(() => {
        console.log(`Selected Existing Action changed to ${selectedExistingAction}`);
    }, [selectedExistingAction]);

    useEffect(() => {
        console.log(`SaveAsNamedAction changed to ${saveAsNamedActionCheckbox}`)
    }, [saveAsNamedActionCheckbox]);

    // #######################################################################################

    /**
     * Updates the transitions when a node is renamed.
     *
     * This function updates the source and target names of transitions in the edges
     * whenever a node is renamed. It ensures that any transition involving the renamed
     * node reflects the new name.
     *
     * @param {string} oldName - The old name of the node before renaming.
     * @param {string} newName - The new name of the node after renaming.
     */
    const updateTransitionsOnRename = useCallback((oldName: string, newName: string) => {
        setEdges(edges => edges.map(edge => {
            if (edge.data?.transition) {
                const transition = edge.data.transition;
                let updated = false;
                if (transition.getSource() === oldName) {
                    transition.setSource(newName);
                    updated = true;
                }
                if (transition.getTarget() === oldName) {
                    transition.setTarget(newName);
                    updated = true;
                }
                if (updated) {
                    return { ...edge, data: { ...edge.data, transition } };
                }
            }
            return edge;
        }));
    }, [setEdges]);


    // TODO: REFACTOR
    /**
     * Handles form submission for updating node properties and adding actions.
     *
     * This function is triggered when the form is submitted. It prevents the default form submission behavior,
     * retrieves form element values, validates the new name, creates and validates a new action if specified,
     * updates the node's name, and adds the new action to the node if applicable.
     *
     * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
     */
    const onFormSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedNode) return;

        const formElements = event.currentTarget.elements as typeof event.currentTarget.elements & {
            "delay-input-value": HTMLInputElement,
            "save-as-named-action-checkbox": HTMLInputElement,

            //EXISTING ACTION
            "existing-action-select": HTMLSelectElement

            // SELECT ACTION
            "select-action-type": HTMLSelectElement,
            "select-action-category": HTMLSelectElement,

            // RAISE EVENT ACTION
            "new-raise-event-input": HTMLInputElement,
            "raise-event-props": HTMLSelectElement,
            "new-action-name": HTMLInputElement,
            // INVOKE ACTION
            "invoke-description-input": HTMLInputElement,
            "invoke-service-type-select": HTMLSelectElement,
            "invoke-service-level-select": HTMLSelectElement,
            // INVOKE OPTIONALS
            "invoke-duration-value-input": HTMLInputElement,
            "invoke-duration-timeunit-select": HTMLSelectElement
            "invoke-memory-input-value": HTMLInputElement,
            "invoke-memory-unit-select": HTMLSelectElement,
            "invoke-cpu-utilization-input": HTMLInputElement,
            //CREATE ACTION
            "create-description-input": HTMLInputElement,
            "create-variable-name-input": HTMLInputElement,
            "create-variable-value-input": HTMLInputElement,
            "create-persistent-checkbox": HTMLInputElement,
            //ASSIGN ACTION
            "assign-variable-select": HTMLInputElement,
            "assign-action-variable-value-input": HTMLInputElement,
            // LOCK ACTION
            "lock-variable-select": HTMLSelectElement,
            // UNLOCK ACTION
            "unlock-variable-select": HTMLSelectElement
        };


        //EXISTING ACTION
        const existingActionName = formElements["existing-action-select"]?.value

        // RAISE EVENT
        const newActionType = formElements["select-action-type"]?.value;
        const newActionCategory = formElements["select-action-category"]?.value;
        const newRaiseEventName = formElements["new-raise-event-input"]?.value;
        const newActionName = formElements["new-action-name"]?.value;
        const existingEventName: string = formElements["raise-event-props"]?.value;

        //INVOKE
        const invokeActionDescription: string = formElements["invoke-description-input"]?.value;
        const invokeServiceType: string = formElements["invoke-service-type-select"]?.value;
        const invokeServiceLevel: string = formElements["invoke-service-level-select"]?.value;

        // INVOKE OPTIONALS
        const invokeActionDuration = formElements["invoke-duration-value-input"]?.value;
        const invokeActionTimeUnit = formElements["invoke-duration-timeunit-select"]?.value;
        const invokeMemoryUtilization = formElements["invoke-memory-input-value"]?.value;
        const invokeMemoryUnit = formElements["invoke-memory-unit-select"]?.value;
        const invokeCpuUtilization = formElements["invoke-cpu-utilization-input"]?.value;


        //CREATE
        const createDescription: string = formElements["create-description-input"]?.value;
        const createVariableName: string = formElements["create-variable-name-input"]?.value;
        const createVariableValue: string = formElements["create-variable-value-input"]?.value;
        const createVariableIsPersistentCheckbox: boolean = formElements["create-persistent-checkbox"]?.checked;

        //ASSIGN
        const assignVariableName: string = formElements["assign-variable-select"]?.value;
        const assignVariableValue: string = formElements["assign-action-variable-value-input"]?.value;

        // LOCK
        const lockVariableName: string = formElements["lock-variable-select"]?.value;

        //UNLOCK
        const unlockVariableName: string = formElements["unlock-variable-select"]?.value;






        const delay = formElements["delay-input-value"]?.value
        const saveAsNamedAction = formElements["save-as-named-action-checkbox"]?.checked;

        console.log("EXISTING ACTION ",existingActionName)


        let newAction = undefined;

        if(newActionType === "use-existing-action" && existingActionName){
            newAction = actionService.getActionByName(existingActionName);
            if(!newAction){
                console.error("Existing action not found")
                return
            }
            if(newActionCategory === ActionCategory.TIMEOUT && delay) {
                newAction.delay = parseInt(delay);
            }
        }

        if(newActionType !== "no-new-action" && newActionType !== "use-existing-action") {
            if(newActionName && (!actionService.isNameUnique(newActionName))) {
                console.error("Action name already exists!");
                return;
            }
            if(newEventName && (!eventService.isNameUnique(newRaiseEventName))) {
                console.error("Event name already exists!")
                return;
            }


            newAction = new Action(newActionName ? newActionName : "", newActionType as ActionType);

            if(delay){
                newAction.delay = parseInt(delay);
            }

            // TODO: Extend to other types
            switch (newActionType) {
                case ActionType.RAISE_EVENT: {
                    newAction.properties = {"event": newRaiseEventName? newRaiseEventName : existingEventName};
                    break;
                }
                case ActionType.INVOKE: {
                    newAction.properties = {
                        "description": invokeActionDescription,
                        "serviceType": invokeServiceType,
                        "serviceLevel": invokeServiceLevel

                    }
                    if(invokeActionDuration){
                        newAction.properties = {...newAction.properties,
                        "duration": {
                            "value": invokeActionDuration,
                            "unit": invokeActionTimeUnit
                        }};
                    }
                    if(invokeMemoryUtilization){
                        newAction.properties = {...newAction.properties,
                            "memory":{
                                "value": invokeMemoryUtilization,
                                "unit": invokeMemoryUnit
                            }};
                    }

                    if(invokeCpuUtilization){
                        newAction.properties = {...newAction.properties,
                        "cpu": invokeCpuUtilization}
                    }

                    break;
                }
                case ActionType.CREATE: {
                    const newContext = contextService.createContext(createVariableName,createVariableValue)
                    if(!contextService.isContextNameUnique(newContext)){
                        console.error(`Context with name ${newContext.name} already exists!`)
                        return;
                    }

                    newAction.context = newContext

                    newAction.properties = {
                        "description": createDescription,
                        "variable" : newContext.name,
                        "value" :newContext.value,
                        "isPersistent" : createVariableIsPersistentCheckbox
                    }

                    contextService.registerContext(newContext)

                    break
                }
                case ActionType.ASSIGN: {
                    newAction.properties = {
                        "variable" : assignVariableName,
                        "value": assignVariableValue
                    }
                    break
                }
                case ActionType.LOCK: {
                    newAction.properties = {
                        "variable" : lockVariableName,
                    }
                    break;
                }
                case ActionType.UNLOCK: {
                    newAction.properties = {
                        "variable" : unlockVariableName,
                    }
                    break;
                }
                default: break;
            }



        }



        if(newAction) {
            const newNodes = nodes.map(node => {
                if (node.id === selectedNode.id) {
                    const newData = stateOrStateMachineService.addActionToState(node.data, newAction, newActionCategory as ActionCategory);
                    return { ...node, data: newData };
                }
                return node;
            });

            if(newActionType !== "use-existing-action" && saveAsNamedAction){
                console.log(`TYPE: ${selectedActionType}`)
                actionService.registerName(newAction.name,newAction);
            }

            if(newRaiseEventName){
                eventService.registerEvent(newRaiseEventName);
            }
            setNodes(newNodes)

            console.log(`New action ${newAction.name} props:`)
            if(delay){
                console.log(`New Action Delay: ${newAction.delay}`)
            }
            Object.entries(newAction.properties).map(([key, val]) => console.log(key, '=>', val));
        }

        setNewActionName("")


    }, [selectedNode, stateOrStateMachineService, nodes, setNodes, updateTransitionsOnRename, actionService, newEventName, eventService, contextService, selectedActionType]);
    

    // TODO: Style to make it more readable
    // Show Category etc.
    const showActions = (data: CsmNodeProps) => {
        let count = 0;
        if(isState(data)){
            return(
                data.state.getAllActions().map((action) => {
                   return <p key={action.name + count++}>{"Name: " + action.name + ` | type: ${action.type}`}</p>
                })
            )
        }
        if(isStateMachine(data)){
            return(
                data.stateMachine.actions.map((action) => {
                    return <p key={action.name + count++}>{"Name: " + action.name + ` | type: ${action.type}`}</p>
                })
            )
        }

        return (<p>Unknown type</p>)
    }


    // All these on change functions could be refactored into inline functions.
    // Well keep them for now should we ever want for complicated logic.
    const onActionTypeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedActionType(event.target.value);
    }


    const onCategorySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedActionCategory(event.target.value);
    }

    const onRaiseEventSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(`RAISE EVENT SELECTION ${event.target.value}`);
        setRaiseEventSelectedType(event.target.value);
    }

    const onNewEventNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewEventName(event.target.value);
    }

    const onNewActionNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewActionName(event.target.value)
    }

    const onInvokeDescriptionInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInvokeDescriptionInput(event.target.value);
    }

    const onCreateDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCreateDescriptionInput(event.target.value);
    }

    const onCreateVariableNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCreateVariableInput(event.target.value);
    }

    const onCreateVariableValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCreateVariableValueInput(event.target.value);
    }

    const onSelectedServiceTypeChange =(event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedServiceType(event.target.value);
    }

    const onSelectedServiceLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedServiceLevel(event.target.value);
    }

    const onIsPersistentCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsPersistentCheckbox(event.target.checked);
    }

    const onSelectedContextVariableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedContextVariable(event.target.value)
    }

    const onAssignActionValueInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAssignActionValueInput(event.target.value);
    }

    const onInvokeDurationValueInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInvokeDurationValueInput(event.target.value);
    }

    const onSelectedTimeUnitChange = (event: React.ChangeEvent<HTMLSelectElement>) =>{
        setSelectedTimeUnit(event.target.value)
    }

    const onInvokeMemoryValueInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInvokeMemoryValueInput(event.target.value);
    }

    const onSelectedMemoryUnitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMemoryUnit(event.target.value)
    }

    const onSelectedExistingActionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedExistingAction(event.target.value)
    }

    const onSaveAsNamedActionCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSaveAsNamedActionCheckbox(event.target.checked);
    }

    const onDelayValueInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(!event.target.value){
            setDelayValueInput("");
        }
        const value = parseInt(event.target.value);
        if (!isNaN(value)) {
            setDelayValueInput(value);

        } else {
            console.error("Delay needs to be a number")
            setInvokeCpuUtilizationInput("");
        }
    }

    const onInvokeCpuUtilizationInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(!event.target.value){
            setDelayValueInput("");
        }
        const value = parseFloat(event.target.value);
        if (!isNaN(value)) {
            if(value >= 0 && value <= 1) {
                setInvokeCpuUtilizationInput(value);
            }
            else{
                console.error(`Cpu utilization needs to be between 0 and 1. Received value: ${value}`)
                setInvokeCpuUtilizationInput("")
            }

        } else {
            setInvokeCpuUtilizationInput("");
        }
    }

    const onNewActionFormButtonClick = useCallback((_: React.MouseEvent<HTMLButtonElement>) => {
        setShowNewActionForm(true)
        console.log("new action button clicked at", new Date().toISOString());
    },[])



     const renderEventsAsOptions = () => {
        return (
            eventService.getAllEvents().map((event: string) => {
                return(
                    <option key={event} value={event}>{event}</option>
                )
            })
        )
    }

    const renderActionNamesAsOptions = () => {
        return(
            actionService.getAllActionNames().map((action: string) => {
                return(
                    <option key={action} value={action}>{action}</option>
                )
            })
        )
    }

    const renderContextNamesAsOptions = () => {
        return(
            contextService.getAllContextNames().map((contextName: string) => {
                return <option key={contextName} value={contextName} >{contextName}</option>
            })
        )
    }



    // TODO: Refactor ids/values to be more self explanatory
    const renderActionProperties = () => {
        switch (selectedActionType){
            case ActionType.RAISE_EVENT: {
                return(
                    <div className="raise-event-form">
                        <label htmlFor="raise-event-props">Select Event: </label>
                        <select id="raise-event-props" name="raise-event-props" onChange={onRaiseEventSelectChange}
                                defaultValue={"new-raise-event"}>
                            {renderEventsAsOptions()}
                            <option key="new-raise-event" value="new-raise-event">New Event</option>
                        </select>
                        {raiseEventSelectedType === "new-raise-event" && (
                            <div className="new-raise-event-input-container">
                                <label htmlFor="new-raise-event-input">New Event Name:  </label>
                                <input type="text" id="new-raise-event-input" name="new-raise-event-input"
                                       value={newEventName} onChange={onNewEventNameChange}/>
                            </div>
                        )}
                    </div>
                )
            }
            case ActionType.INVOKE: {
                return(
                    <div className="invoke-action-form">
                        <label htmlFor="invoke-description-input">Description:  </label>
                        <input type="text" id="invoke-description-input" name="invoke-description-input"
                               value={invokeDescriptionInput} onChange={onInvokeDescriptionInputChange}/>
                        <br/>
                        <label htmlFor="invoke-service-type-select">Service Type: </label>
                        <select id="invoke-service-type-select" name="invoke-service-type-select"
                                value={selectedServiceType} onChange={onSelectedServiceTypeChange}>
                            {renderEnumAsOptions(ServiceType)}
                        </select>
                        <br/>
                        <label htmlFor="invoke-service-level-select">Service Level: </label>
                        <select id="invoke-service-level-select" name="invoke-service-level-select"
                                value={selectedServiceLevel} onChange={onSelectedServiceLevelChange}>
                            {renderEnumAsOptions(ServiceLevel)}
                        </select>
                        <div className="invoke-action-additional-properties-container">
                            <hr/>
                            <h4>Additional Properties (Optional)</h4>
                            <label htmlFor="invoke-duration-value-input">Duration: </label>
                            <input type="text" id="invoke-duration-value-input" name="invoke-duration-value-input" value={invokeDurationValueInput} onChange={onInvokeDurationValueInputChange}/>
                            <select id="invoke-duration-timeunit-select" name="invoke-duration-timeunit-select" value={selectedTimeUnit} onChange={onSelectedTimeUnitChange}>
                                {renderEnumAsOptions(TimeUnit)}
                            </select>
                            <br/>
                            <label htmlFor="invoke-memory-input">Memory: </label>
                            <input type="text" id="invoke-memory-input-value" name="invoke-memory-input-value" value={invokeMemoryValueInput} onChange={onInvokeMemoryValueInputChange}/>
                            <select id="invoke-memory-unit-select" name="invoke-memory-unit-select" value={selectedMemoryUnit} onChange={onSelectedMemoryUnitChange}>
                                {renderEnumAsOptions(MemoryUnit)}
                            </select>
                            <label htmlFor="invoke-cpu-utilization-input">CPU Utilization: </label>
                            <input type="number" id="invoke-cpu-utilization-input" name="invoke-cpu-utilization-input" value={invokeCpuUtilizationInput} onChange={onInvokeCpuUtilizationInputChange}/>
                        </div>
                        <hr/>

                    </div>
                )
            }
            case ActionType.CREATE: {
                return (
                    <div className="create-action-form">
                        <label htmlFor="create-description-input">Description: </label>
                        <input type="text" id="create-description-input" name="create-description-input"
                               value={createDescriptionInput}
                               onChange={onCreateDescriptionChange}/>
                        <label htmlFor="create-variable-name-input">Variable Name: </label>
                        <input type="text" id="create-variable-name-input" name="create-variable-name-input"
                               value={createVariableNameInput}
                               onChange={onCreateVariableNameChange}/>
                        <label htmlFor="create-variable-value-input">Variable Value: </label>
                        <input type="text" id="create-variable-value-input" name="create-variable-value-input"
                               value={createVariableValueInput}
                               onChange={onCreateVariableValueChange}/>

                        <label htmlFor="create-persistent-checkbox">Make Persistent</label>
                        <input type="checkbox" id="create-persistent-checkbox" name="create-persistent-checkbox" checked={isPersistentCheckbox}
                               onChange={onIsPersistentCheckboxChange}/>


                    </div>
                )
            }
            case ActionType.ASSIGN: {
                return(
                    <div className="assign-action-form">
                        {contextService.getAllContextNames().length >= 1 ?
                            (<div className="asssign-action-variable-select-container">
                                    <label htmlFor="assign-variable-select">Select Variable</label>
                                    <select id="assign-variable-select" name="assign-variable-select" value={selectedContextVariable} onChange={onSelectedContextVariableChange}>
                                    {renderContextNamesAsOptions()}
                                    </select>
                                    <br/>
                                    <label htmlFor="assign-action-variable-value-input">Value To Assign:  </label>
                                    <input type="text" id="assign-action-variable-value-input" name="assign-action-variable-value-input" value={assignActionValueInput} onChange={onAssignActionValueInputChange}/>
                            </div>
                            )
                        : <p>No Context Variables found</p>}
                    </div>
                )
            }
            case ActionType.LOCK: {
                return(
                    <div className="lock-action-form">
                        {contextService.getAllContextNames().length >= 1 ? (
                            <div className="lock-action-variable-select-container">
                            <label htmlFor="lock-variable-select">Variable To Lock: </label>
                            <select id="lock-variable-select" name="lock-variable-select"
                                    value={selectedContextVariable} onChange={onSelectedContextVariableChange}>
                                {renderContextNamesAsOptions()}
                            </select>
                            </div>
                        ): <p>No Context Variables found</p>

                        }
                    </div>
                )
            }
            case ActionType.UNLOCK: {
                return(
                    <div className="unlock-action-form">
                        {contextService.getAllContextNames().length >= 1 ? (
                            <div className="unlock-action-variable-select-container">
                                <label htmlFor="unlock-variable-select">Variable To Unlock: </label>
                                <select id="unlock-variable-select" name="unlock-variable-select"
                                        value={selectedContextVariable} onChange={onSelectedContextVariableChange}>
                                    {renderContextNamesAsOptions()}
                                </select>
                            </div>
                        ): <p>No Context Variables found</p>

                        }
                    </div>
                )
            }
            default : {
                return <></>
            }
        }
    }


    return (
        selectedNode && (
            <Container>
                <Offcanvas show={showSidebar} scroll={true} backdrop={false} placement={"end"}>
                    <OffcanvasHeader closeButton={true} onClick={() => {setShowSidebar(false)}}>
                        <Offcanvas.Title>{stateOrStateMachineService.getName(selectedNode.data)}</Offcanvas.Title>
                    </OffcanvasHeader>
                    <OffcanvasBody>
                        <RenameNodeComponent/>
                        <br/>
                        <Container>
                            <ContextModal variable={undefined}></ContextModal>
                        </Container>

                        <br/>
                        <div className="d-grid gap-2">
                            <Button variant="primary" size="lg" onClick={onNewActionFormButtonClick}>
                                New Action
                            </Button>
                        </div>
                        {showNewActionForm && (
                            <div className={"action-form-container"}>
                                <ActionDisplay action={undefined}></ActionDisplay>
                            </div>
                        )}
                    </OffcanvasBody>
                </Offcanvas>
            </Container>
        )
    )
//TODO: Make this look good
    /**
     return (
     showSidebar && selectedNode && (
            <div className="node-form">
                <RenameNodeComponent></RenameNodeComponent>
                <ActionDisplay></ActionDisplay>
                <form onSubmit={onFormSubmit}>
                    <h3>Hi mom! It's me {stateOrStateMachineService.getName(selectedNode.data)}!</h3>
                    <div className="from-action-section">
                        <label htmlFor="select-action-type">Add action: </label>
                        <select id="select-action-type" name="select-action-type" onChange={onActionTypeSelect}
                                defaultValue={selectedActionType || "no-new-action"}>
                            <option key={"no-new-action"} value={"no-new-action"}>No</option>
                            <option key={"use-existing-action"} value={"use-existing-action"}>Use Existing Action</option>
                            <optgroup label="Create New Action">
                                {renderEnumAsOptions(ActionType)}
                            </optgroup>

                        </select>

                        {selectedActionType && selectedActionType === "use-existing-action" && (
                            <div className="existing-action-section-container">
                                {actionService.getAllActionNames().length >= 1 &&
                                    (
                                    <select id="existing-action-select" name="existing-action-select" value={selectedExistingAction} onChange={onSelectedExistingActionChange}>
                                        {renderActionNamesAsOptions()}
                                    </select>)
                                    || (
                                        <p>No Existing Actions Found</p>
                                    )
                                }
                            </div>
                        )}
                        {selectedActionType && selectedActionType !=="no-new-action" &&(
                            <div className="from-action-category-section">
                                <label htmlFor="select-action-category">Action Category: </label>
                                <select id="select-action-category" name="select-action-category"
                                        onChange={onCategorySelect} defaultValue={selectedActionCategory}>
                                    {renderEnumAsOptions(ActionCategory)}
                                </select>
                            </div>
                        )}
                        {selectedActionType && selectedActionCategory === ActionCategory.TIMEOUT &&(
                            <div className="delay-input-container">
                                <label htmlFor="delay-input-value">Delay: </label>
                                <input type="text" id="delay-input-value" name ="delay-input-value" value={delayValueInput} onChange={onDelayValueInputChange}/>
                            </div>
                        )}
                        {selectedActionType && selectedActionType !== "no-new-action" && selectedActionType!== "use-existing-action" && renderActionProperties()}
                        {selectedActionType && selectedActionType !== "no-new-action"  && selectedActionType!== "use-existing-action" &&  (
                            <div>
                                <label htmlFor="save-as-named-action-checkbox">Save as named action ? </label>
                                <input type="checkbox" id="save-as-named-action-checkbox" name="save-as-named-action-checkbox" checked={saveAsNamedActionCheckbox} onChange={onSaveAsNamedActionCheckboxChange}/>
                                <br/>
                                {saveAsNamedActionCheckbox && (
                                    <div className="new-action-name-container">
                                        <label htmlFor="new-action-name">Action name: </label>
                                        <input type="text" id="new-action-name" name="new-action-name"
                                               value={newActionName}
                                               onChange={onNewActionNameChange}/>
                                    </div>
                                )
                                }
                            </div>
                        )}
                    </div>
                    <h3>Actions: </h3>
                    {showActions(selectedNode.data)}
                    <button type="submit">Save Changes</button>
                </form>
            </div>
        )
    );
        */
}
