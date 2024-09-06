import {Accordion, CardGroup} from "react-bootstrap";
import ContextCard from "./contextCard.tsx";
import {Dispatch, SetStateAction} from "react";
import ContextVariable from "../../classes/contextVariable.tsx";

export default function ContextCardDisplay(props: {vars: ContextVariable[], headerText: string | undefined, setVars: Dispatch<SetStateAction<ContextVariable[]>>}) {

    const headerText = () => props.headerText || "Display Context Variables";

    return (
        <Accordion>
            <Accordion.Item eventKey={"0"}>
                <Accordion.Header>{headerText()}</Accordion.Header>
                <Accordion.Body>
                    <CardGroup>
                        {props.vars.map((v) => (
                            <ContextCard key={`${v.name}-card`} contextVariable={v} setVars={props.setVars} />
                        ))}
                    </CardGroup>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}
