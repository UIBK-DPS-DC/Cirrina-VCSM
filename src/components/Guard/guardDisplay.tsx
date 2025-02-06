import Guard from "../../classes/guard.tsx";
import React, {SetStateAction} from "react";
import {Accordion, AccordionItem} from "react-bootstrap";
import GuardCard from "./guardCard.tsx";

export default function GuardDisplay(props: {guards: Guard[],
    setGuards: React.Dispatch<SetStateAction<Guard[]>>,
    headerText?: string,
    onSubmit? : () => void,
    onDelete?: (guard: Guard) => void}) {

    let guardCount = 0

    const headerText = () => props.headerText || "Show Guards";


    return (
        <Accordion>
            <AccordionItem eventKey={"0"}>
                <Accordion.Header>{headerText()}</Accordion.Header>
                <Accordion.Body>
                    {props.guards.map((guard) => {
                        return <GuardCard key={guardCount++} guard={guard} setGuards={props.setGuards} onSubmit={props.onSubmit} onDelete={props.onDelete} />
                    })}
                </Accordion.Body>
            </AccordionItem>
        </Accordion>
    )

}