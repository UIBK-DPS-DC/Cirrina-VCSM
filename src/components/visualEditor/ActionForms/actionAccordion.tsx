import {Accordion, AccordionBody, AccordionHeader, AccordionItem} from "react-bootstrap";
import Action from "../../../classes/action.ts";
import {Dispatch, SetStateAction} from "react";
import ActionDisplay from "./actionDisplay.tsx";

export default function ActionAccordion(props: {headerText: string,
    actions: Action[],
    setInvokeActions: Dispatch<SetStateAction<Action[]>>,
    setCreateActions: Dispatch<SetStateAction<Action[]>>,
    setAssignActions: Dispatch<SetStateAction<Action[]>>,
    setRaiseEventActions: Dispatch<SetStateAction<Action[]>>}) {

    let keyCount = 0



    return(
        <Accordion>
            <AccordionItem eventKey={"0"}>
                <AccordionHeader>{props.headerText}</AccordionHeader>
                <AccordionBody>
                    {props.actions.map((a) => {
                        return <ActionDisplay key={`AD-${keyCount++}`}
                                              action={a}
                                              setInvokeActions={props.setInvokeActions}
                                              setCreateActions={props.setCreateActions}
                                              setAssignActions={props.setAssignActions} setRaiseEventActions={props.setRaiseEventActions}/>
                    })}
                </AccordionBody>
            </AccordionItem>
        </Accordion>
    )

}