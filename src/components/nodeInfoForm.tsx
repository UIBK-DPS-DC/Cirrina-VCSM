import React, {ChangeEvent, useCallback, useContext, useEffect, useState} from "react";
import { ReactFlowContext } from "./flow.tsx";
import {CsmNodeProps, isState, isStateMachine, ReactFlowContextProps} from "../types.ts";
import {ActionCategory, ActionType, ServiceLevel, ServiceType} from "../enums.tsx";
import Action from "../classes/action.tsx";
import {b} from "vite/dist/node/types.d-aGj9QkWt";

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
        nameInput,
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
    const [createDescriptionInput, setCreateDescriptionInput] = useState<string>("")
    const [createVariableNameInput, setCreateVariableInput] = useState<string>("")
    const [createVariableValueInput, setCreateVariableValueInput] = useState<string>("")
    const [isPersistentCheckbox, setIsPersistentCheckbox] = useState<boolean>(false);

    type OptionEnums = typeof ActionType | typeof ServiceType | typeof ServiceLevel | typeof ActionCategory


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
            name: HTMLInputElement,
            "select-action-type": HTMLSelectElement,
            "select-action-category": HTMLSelectElement,
            "new-raise-event-input": HTMLInputElement,
            "raise-event-props": HTMLSelectElement,
            "new-action-name": HTMLInputElement,
            "invoke-description-input": HTMLInputElement,
            "invoke-service-type-select": HTMLSelectElement,
            "invoke-service-level-select": HTMLSelectElement
        };




        const newActionType = formElements["select-action-type"]?.value;
        const newActionCategory = formElements["select-action-category"]?.value;
        const newRaiseEventName = formElements["new-raise-event-input"]?.value;
        const newActionName = formElements["new-action-name"]?.value;
        const existingEventName: string = formElements["raise-event-props"]?.value;

        const invokeActionDescription: string = formElements["invoke-description-input"]?.value;
        const invokeServiceType: string = formElements["invoke-service-type-select"]?.value;
        const invokeServiceLevel: string = formElements["invoke-service-level-select"]?.value;

        console.log(invokeActionDescription);
        console.log(invokeServiceType);
        console.log(invokeServiceLevel);


        const newName = formElements.name.value;
        const oldName = stateOrStateMachineService.getName(selectedNode.data);

        if (!stateOrStateMachineService.isNameUnique(newName) && newName !== oldName) {
            console.error(`StateOrStateMachine name ${newName} already exists!`);
            return;
        }

        let newAction = undefined;

        if(newActionType !== "no-new-action") {
            if(newActionName && (!actionService.isNameUnique(newActionName))) {
                console.error("Action name already exists!");
                return;
            }
            if(newEventName && (!eventService.isNameUnique(newRaiseEventName))) {
                console.error("Event name already exists!")
                return;
            }

            newAction = new Action(newActionName, newActionType as ActionType);

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
                    break;
                }
                default: break;
            }



        }

        if (newName !== oldName) {
            const newNodes = nodes.map(node => {
                if (node.id === selectedNode.id) {
                    const newData = stateOrStateMachineService.setName(newName, node.data);
                    return { ...node, data: newData };
                }
                return node;
            });

            stateOrStateMachineService.unregisterName(oldName);
            stateOrStateMachineService.registerName(newName);
            setNodes(newNodes);
            updateTransitionsOnRename(oldName, newName);
        }

        if(newAction) {
            const newNodes = nodes.map(node => {
                if (node.id === selectedNode.id) {
                    const newData = stateOrStateMachineService.addActionToState(node.data, newAction, newActionCategory as ActionCategory);
                    return { ...node, data: newData };
                }
                return node;
            });

            actionService.registerName(newAction.name);
            if(newRaiseEventName){
                eventService.registerName(newRaiseEventName);
            }
            setNodes(newNodes)

            console.log(`New action props:`)
            Object.entries(newAction.properties).map(([key, val]) => console.log(key, '=>', val));
        }


    }, [nodes, setNodes, selectedNode, stateOrStateMachineService, updateTransitionsOnRename]);

    const onNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNameInput(event.target.value);
    };

    // TODO: Style to make it more readable
    const showActions = (data: CsmNodeProps) => {

        if(isState(data)){
            return(
                data.state.getAllActions().map((action) => {
                   return <p key={action.name}>{action.name}</p>
                })
            )
        }
        if(isStateMachine(data)){
            return(
                data.stateMachine.actions.map((action) => {
                    return <p key={action.name}>{action.name}</p>
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


    const renderEventsAsOptions = () => {
        return (
            eventService.getAllEvents().map((event: string) => {
                return(
                    <option key={event} value={event}>{event}</option>
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

    const renderEnumAsOptions = (enumObject: OptionEnums) => {
        return (
            Object.values(enumObject).map((value) => {
                return <option key={value} value={value}>{value}</option>
            })
        );
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
                        <input type="checkbox" id="create-persistent-checkbox" name="create-persistent-checkbox"
                               checked={isPersistentCheckbox}
                               onChange={onIsPersistentCheckboxChange}/>


                    </div>
                )
            }
            default : {
                return <></>
            }
        }
    }
    //TODO: Make this look good
    return (
        showSidebar && selectedNode && (
            <div className="node-form">
                <form onSubmit={onFormSubmit}>
                    <h3>Hi mom! It's me {stateOrStateMachineService.getName(selectedNode.data)}!</h3>
                    <label htmlFor="name">Name: </label>
                    <input type="text" id="name" name="name" value={nameInput} onChange={onNameInputChange} />

                    <div className="from-action-section">
                        <label htmlFor="select-action-type">Add action: </label>
                        <select id="select-action-type" name="select-action-type" onChange={onActionTypeSelect}
                                defaultValue={selectedActionType || "no-new-action"}>
                            <option key={"no-new-action"} value={"no-new-action"}>No</option>
                            {renderEnumAsOptions(ActionType)}
                        </select>


                        {selectedActionType && selectedActionType !=="no-new-action" && (
                            <div className="from-action-category-section">
                                <label htmlFor="select-action-category">Action Category: </label>
                                <select id="select-action-category" name="select-action-category"
                                        onChange={onCategorySelect} defaultValue={selectedActionCategory}>
                                    {renderEnumAsOptions(ActionCategory)}
                                </select>
                            </div>
                        )}
                        {selectedActionType && selectedActionType !== "no-new-action" && renderActionProperties()}
                        {selectedActionType && selectedActionType !== "no-new-action" && (
                            <div>
                            <label htmlFor="new-action-name">Action name: </label>
                            <input type="text" id="new-action-name" name="new-action-name" value={newActionName}
                                   onChange={onNewActionNameChange}/>
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
}
