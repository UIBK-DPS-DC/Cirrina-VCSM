import Event from "../../classes/event.ts";
import {Card, Container} from "react-bootstrap";
import {Dispatch, SetStateAction} from "react";
import ContextVariable from "../../classes/contextVariable.tsx";
import ContextCardDisplay from "../Context/contextCardDisplay.tsx";
import CreateEventModal from "./createEventModal.tsx";
export default function EventCard(props: {event: Event, setEvents: Dispatch<SetStateAction<Event[]>>, vars: ContextVariable[],setVars: Dispatch<SetStateAction<ContextVariable[]>>}) {



    const handleEventEdit = (updatedEvent: Event) => {
        props.setEvents(prevState =>
            prevState.map(e => e.name === updatedEvent.name ? updatedEvent : e)
        );
    };


    return (
        <Container>
            <Card className={"mb-3"} border={"info"}>
                <Card.Body >
                    <Card.Title>{props.event.name}</Card.Title>
                    <Card.Text>
                        Event Channel: {props.event.channel}
                    </Card.Text>
                    <ContextCardDisplay vars={props.vars} headerText={"Show Vars"} setVars={props.setVars} event={props.event} ></ContextCardDisplay>
                </Card.Body>
                <Card.Footer>
                    <CreateEventModal event={props.event} onSubmit={handleEventEdit}></CreateEventModal>
                </Card.Footer>
            </Card>
        </Container>
        
    )
}