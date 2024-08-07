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
            setNodes,
            edges
        } = context;


        const [selectedEvent, setSelectedEvent] = useState<string>("new-event")
        const [newEventValueInput, setNewEventValueInput] = useState("");
        const onFormSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            if(!selectedEdge?.data) return;



            const formElements = event.currentTarget.elements as typeof event.currentTarget.elements & {
                "transition-event-select": HTMLSelectElement,
                "new-event-input": HTMLInputElement,

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
                        <button type="submit">Save Changes</button>
                    </form>
                </div>
                )
        )


}