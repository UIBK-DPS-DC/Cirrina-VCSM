import {Accordion, CardGroup} from "react-bootstrap";
import ContextCard from "./contextCard.tsx";
import {Dispatch, SetStateAction} from "react";


export default function ContextCardDisplay(props: {vars: string[], headerText: string | undefined, setVars: Dispatch<SetStateAction<string[]>>}) {

    const headerText = () => props.headerText || "Display Context Variables"

    return(
        <Accordion>
            <Accordion.Item eventKey={"0"}>
                <Accordion.Header>{headerText()}</Accordion.Header>
                <Accordion.Body>
                    <CardGroup>
                        {props.vars.map((v) => {
                            return (
                                <ContextCard key={`${v}-card`} contextVariable={v} setVars={props.setVars}/>
                            )
                        })}
                    </CardGroup>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}