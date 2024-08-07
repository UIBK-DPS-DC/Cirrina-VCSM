import {ReactFlowContext} from "./flow.tsx";
import React, {FormEvent, useCallback, useContext, useState} from "react";
import {isState, ReactFlowContextProps} from "../types.ts";



export default function TransitionInfoForm() {
        const context = useContext(ReactFlowContext) as ReactFlowContextProps;
        const {
            selectedEdge,
            showSidebar,
            eventService,
            stateOrStateMachineService
        } = context;


        const [selectedEvent, setSelectedEvent] = useState<string>("new-event")
        const [newEventValueInput, setNewEventValueInput] = useState("");
        const onFormSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            console.log("Entering onForm")
            if(!selectedEdge?.data) return;



            const formElements = event.currentTarget.elements as typeof event.currentTarget.elements & {
                "transition-event-select": HTMLSelectElement,
                "new-event-input": HTMLInputElement,

            }

            const selectedEvent =formElements["transition-event-select"]?.value
            const newEventName = formElements["new-event-input"]?.value

            if(selectedEvent === "new-event") {
                console.log("NEW EVENT")
                if(!eventService.isNameUnique(newEventName)) {
                    console.error(`Event ${newEventName} is not unique`);
                    return;
                }
                const sourceState =
                    stateOrStateMachineService.getStateOrStateMachineByName(selectedEdge.data.transition.getSource())
                console.log(sourceState)
                if(!sourceState) {
                    console.error(`Source state ${selectedEdge.data.transition.getSource()} could not be found`);
                    return;
                }
                // TODO: Transition class needs to be updated.


            }


        },[selectedEdge,selectedEvent,eventService,stateOrStateMachineService])


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