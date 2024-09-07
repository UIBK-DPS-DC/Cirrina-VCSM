import {Accordion, AccordionBody, AccordionHeader, AccordionItem} from "react-bootstrap";
import Action from "../../../classes/action.ts";

export default function ActionAccordion(props: {headerText: string, actions: Action[]}) {



    return(
        <Accordion>
            <AccordionItem eventKey={"0"}>
                <AccordionHeader>{props.headerText}</AccordionHeader>
                <AccordionBody>

                </AccordionBody>
            </AccordionItem>
        </Accordion>
    )

}