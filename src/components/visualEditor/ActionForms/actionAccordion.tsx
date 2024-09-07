import {Accordion, AccordionBody, AccordionHeader, AccordionItem} from "react-bootstrap";
import Action from "../../../classes/action.ts";
import {Dispatch, SetStateAction} from "react";
import ActionDisplay from "./actionDisplay.tsx";

export default function ActionAccordion(props: {headerText: string,
    actions: Action[],
    setInvokeActions: Dispatch<SetStateAction<Action[]>>}) {



    return(
        <Accordion>
            <AccordionItem eventKey={"0"}>
                <AccordionHeader>{props.headerText}</AccordionHeader>
                <AccordionBody>
                    {props.actions.map((a) => {
                        return <ActionDisplay action={a} setInvokeActions={props.setInvokeActions}/>
                    })}
                </AccordionBody>
            </AccordionItem>
        </Accordion>
    )

}