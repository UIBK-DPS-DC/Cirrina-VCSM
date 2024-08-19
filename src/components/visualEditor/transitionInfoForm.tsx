import React, {useCallback, useContext, useEffect, useState} from "react";
import {ReactFlowContext} from "../../utils.ts";
import {ReactFlowContextProps} from "../../types.ts";
import State from "../../classes/state.ts";
import Guard from "../../classes/guard.tsx";


export default function TransitionInfoForm() {
    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {
        selectedEdge,
        showSidebar,
        eventService,
        stateOrStateMachineService,
        setEdges,
        edges,
        guardService
    } = context;


    const [selectedEvent, setSelectedEvent] = useState<string>("new-event")
    const [newEventValueInput, setNewEventValueInput] = useState("");
    const [selectedGuardCategory, setSelectedGuardCategory] = useState("no-guard")
    const [transitionGuardInputValue, setTransitionGuardInputValue] = useState<string>("")
    const [guardSelectionValue, setGuardSelectionValue] = useState<string>("")
    const [saveAsNamedGuardCheckbox, setSaveAsNamedGuardCheckbox] = useState<boolean>(false);
    const [newNamedGuardInput, setNewNamedGuardInput] = useState<string>("")

    useEffect(() => {
        console.log(`Save as named guard checkbox checked: ${saveAsNamedGuardCheckbox}`)
    }, [saveAsNamedGuardCheckbox]);

    const renderEventsAsOptions = () => {
        return (
            eventService.getAllEvents().map((event: string) => {
                return(
                    <option key={event} value={event}>{event}</option>
                )
            })
        )
    }

    const renderGuardsAsOptions = () => {
        return(
            guardService.getAllGuardNames().map((guardName: string) => {
                return <option key={guardName} value={guardName}>{guardName + `: ${guardService.getGuardExpression(guardName)}`}</option>
            })
        )
    }

    const onSelectedEventChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedEvent(event.target.value);
    }

    const onNewEventInputValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewEventValueInput(event.target.value);
    }

    const onSelectedGuardCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGuardCategory(event.target.value)
    }

    const onTransitionGuardInputValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTransitionGuardInputValue(event.target.value);
    }

    const onGuardSelectionValueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setGuardSelectionValue(event.target.value);
    }

    const onSaveAsNamedGuardCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSaveAsNamedGuardCheckbox(event.target.checked);
    }

    const onNewNamedGuardInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewNamedGuardInput(event.target.value);
    }






    const onFormSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if(!selectedEdge?.data) return;



        const formElements = event.currentTarget.elements as typeof event.currentTarget.elements & {
            //EVENT
            "transition-event-select": HTMLSelectElement,
            "new-event-input": HTMLInputElement,


            //GUARDS
            "transition-guard-category-select": HTMLSelectElement,
            "transition-guard-input": HTMLInputElement,
            "existing-guard-selection": HTMLSelectElement,
            "save-named-guard-checkbox" :HTMLInputElement,
            "new-named-guard-name-input": HTMLInputElement,




        }

        const selectedEvent = formElements["transition-event-select"]?.value
        const newEventName = formElements["new-event-input"]?.value

        const guardCategory = formElements["transition-guard-category-select"]?.value
        const guardExpression = formElements["transition-guard-input"]?.value
        const existingGuard = formElements["existing-guard-selection"]?.value
        const saveAsNamedGuard  = formElements["save-named-guard-checkbox"]?.checked
        const newNamedGuardName = formElements["new-named-guard-name-input"]?.value





        console.log(`Received Guard Category ${guardCategory}`)
        console.log(guardExpression)
        console.log(existingGuard)
        console.log(saveAsNamedGuard)
        console.log(newNamedGuardName)



        const sourceState =
            stateOrStateMachineService.getStateOrStateMachineByName(selectedEdge.data.transition.getSource())
        if(!sourceState) {
            console.error(`Source state ${selectedEdge.data.transition.getSource()} could not be found`);
            return;
        }

        if(selectedEvent === "new-event") {
            if(! newEventName) {
                console.error("New Event Name is missing");
                return;
            }
            if(!eventService.isNameUnique(newEventName)) {
                console.error(`Event ${newEventName} is not unique`);
                return;
            }
            eventService.registerName(newEventName);
            // TODO: Transition class needs to be updated.
            selectedEdge.data.transition.setEvent(newEventName);


        }
        else {
            selectedEdge.data.transition.setEvent(selectedEvent);
        }

        if(guardCategory !== "no-guard"){
            if(guardCategory === "existing-guard") {
                const existingGuardObject = guardService.getGuardByName(existingGuard)
                if(!existingGuardObject) {
                    console.error(`Guard ${existingGuard} not found`);
                    return
                }
                selectedEdge.data.transition.addGuard(existingGuardObject);
            }
            else {
                // TODO: VALIDATE EXPRESSION HERE
                if(saveAsNamedGuard) {
                    const newGuard = new Guard(guardExpression,newNamedGuardName)
                    guardService.registerGuard(newGuard);
                    selectedEdge.data.transition.addGuard(newGuard);
                }
                else{
                    const newGuard = new Guard(guardExpression);
                    selectedEdge.data.transition.addGuard(newGuard);
                }

            }
        }


        if(sourceState instanceof State) {
            sourceState.addOnTransition(selectedEdge.data.transition);
            console.log(sourceState);
            console.log(sourceState.on);
            setEdges(eds => {
                return eds.map((e) => {
                    if(e.id === selectedEdge.id) {
                        if(selectedEdge.data) {
                            e.data = {
                                ...e.data,
                                transition: selectedEdge.data.transition
                            };
                            return e;

                        }
                        return e;

                    }
                    return e;
                })
            });

        }
        else{
            // TODO: Separate logic for Statemachines?
        }

        console.log(selectedEdge.data.transition.getGuards());


    },[selectedEdge,selectedEvent,eventService,stateOrStateMachineService,setEdges,edges])







    return(
        showSidebar && selectedEdge && selectedEdge.data &&(
            <div className="edge-form">
                <form onSubmit={onFormSubmit}>
                    <h3>Hi dad! Its me {selectedEdge.id}</h3>
                    <h2>I
                        connect {selectedEdge.data.transition.getSource()} to {selectedEdge.data.transition.getTarget()}</h2>
                    <h4>ON: {selectedEdge.data.transition.getEvent()}</h4>

                    <label htmlFor="transition-event-select">On : </label>
                    <select id="transition-event-select" name="transition-event-select" onChange={onSelectedEventChange}
                            value={selectedEvent}>
                        {renderEventsAsOptions()}
                        <option key="new-event" value="new-event">New Event</option>
                    </select>
                    {selectedEvent === "new-event" && (
                        <div className="new-event-input-container">
                            <label htmlFor="new-event-input">New Event Name: </label>
                            <input type="text" id="new-event-input" name="new-event-input" placeholder="New Event Name" value={newEventValueInput} onChange={onNewEventInputValueChange}/>
                        </div>
                    )}
                    <br/>
                    <hr/>
                    <h3>Optional</h3>
                    <div className="transition-guard-container">
                        <label htmlFor="transition-guard-category-select">Add Guard </label>
                        <select id="transition-guard-category-select" name="transition-guard-category-select" value={selectedGuardCategory} onChange={onSelectedGuardCategoryChange}>
                            <option key="no-guard" value="no-guard">No</option>
                            <option key="new-guard" value="new-guard">New Guard</option>
                            <option key="existing-guard" value="existing-guard">Use Existing Guard</option>
                        </select>
                        <br/>
                        {selectedGuardCategory === "new-guard" && (
                            <div className="transition-guard-input-container">
                                <label htmlFor="transition-guard-input">Guard: </label>
                                <input type="text" name="transition-guard-input" id="transition-guard-input" value={transitionGuardInputValue} onChange={onTransitionGuardInputValueChange}/>
                                <br/>
                                <label htmlFor="save-named-guard-checkbox">Save as named Guard?  </label>
                                <input type="checkbox" name ="save-named-guard-checkbox" id="save-named-guard-checkbox" checked={saveAsNamedGuardCheckbox} onChange={onSaveAsNamedGuardCheckboxChange}/>
                                {saveAsNamedGuardCheckbox && (
                                    <div className="new-named-guard-input-container">
                                        <label htmlFor="new-named-guard-name-input">Guard Name: </label>
                                        <input type="text" id="new-named-guard-name-input" name="new-named-guard-name-input" value={newNamedGuardInput} onChange={onNewNamedGuardInputChange}/>
                                    </div>
                                )}
                            </div>
                        )}
                        {selectedGuardCategory === "existing-guard" && guardService.getAllGuardNames().length > 0 && (
                            <div className="existing-guard-select-container">
                                <select id="existing-guard-selection" name="existing-guard-selection" value={guardSelectionValue} onChange={onGuardSelectionValueChange} >
                                    {renderGuardsAsOptions()}
                                </select>
                            </div>

                        ) || selectedGuardCategory === "existing-guard" && (
                            <h4>No existing guards found</h4>
                        )

                        }
                    </div>
                    <hr/>
                    <button type="submit">Save Changes</button>
                </form>
            </div>
        )
    )


}