import Event from "../../classes/event.ts";
import {Accordion, CardGroup} from "react-bootstrap";
import EventCard from "./eventCard.tsx";
import {Dispatch, SetStateAction} from "react";
import ContextVariable from "../../classes/contextVariable.tsx";
import * as events from "node:events";

export default function EventCardDisplay(props: {headerText: string,
    events: Event[],
    setEvents: Dispatch<SetStateAction<Event[]>>,
    vars: ContextVariable[],
    setVars: Dispatch<SetStateAction<ContextVariable[]>>,
}) {
    const headerText = () => props.headerText || "Display Context Variables";

    return (
        <Accordion>
            <Accordion.Item eventKey={"0"}>
                <Accordion.Header>{headerText()}</Accordion.Header>
                <Accordion.Body>
                    {props.events.length > 0 && (
                        <CardGroup>
                            {props.events.map((e) => (
                                <EventCard key={`e-${e.name}`} event={e} setEvents={props.setEvents} setVars={props.setVars} vars={props.vars}></EventCard>
                            ))}
                        </CardGroup>
                    ) || (<h3 className={"text-muted"}>No Events Selected</h3>)}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}