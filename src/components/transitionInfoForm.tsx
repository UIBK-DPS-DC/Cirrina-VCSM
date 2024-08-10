import {ReactFlowContext} from "./flow.tsx";
import React, {useCallback, useContext, useState} from "react";
import {ReactFlowContextProps} from "../types.ts";
import State from "../classes/state.ts";


export default function TransitionInfoForm() {
        const context = useContext(ReactFlowContext) as ReactFlowContextProps;
        const {
            selectedEdge,
            showSidebar,
            eventService,
            stateOrStateMachineService,
            setEdges,
            edges
        } = context;


        const [selectedEvent, setSelectedEvent] = useState<string>("new-event")
        const [newEventValueInput, setNewEventValueInput] = useState("");
        const [selectedGuardCategory, setSelectedGuardCategory] = useState("no-guard")



        const renderEventsAsOptions = () => {
            return (
                eventService.getAllEvents().map((event: string) => {
                    return(
                        <option key={event} value={event}>{event}</option>
                    )
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





        const onFormSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            if(!selectedEdge?.data) return;



            const formElements = event.currentTarget.elements as typeof event.currentTarget.elements & {
                //EVENT
                "transition-event-select": HTMLSelectElement,
                "new-event-input": HTMLInputElement,

                //GUARDS
            }

            const selectedEvent = formElements["transition-event-select"]?.value
            const newEventName = formElements["new-event-input"]?.value

            const sourceState =
                stateOrStateMachineService.getStateOrStateMachineByName(selectedEdge.data.transition.getSource())
            if(!sourceState) {
                console.error(`Source state ${selectedEdge.data.transition.getSource()} could not be found`);
                return;
            }

            if(selectedEvent === "new-event") {
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
            // ADD LOGIC FOR GUARDS HERE

            if(sourceState instanceof State) {
                sourceState.on.push(selectedEdge.data.transition);
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
                                <div className="transition-guard-container">
                                    <label htmlFor="transition-guard-input">Guard: </label>
                                    <input type="text" name="transition-guard-input" id="transition-guard-input"/>
                                </div>
                            )}
                        </div>
                        <hr/>
                        <button type="submit">Save Changes</button>
                    </form>
                </div>
                )
        )


}