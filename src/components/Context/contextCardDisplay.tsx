import {Accordion, CardGroup} from "react-bootstrap";
import Event from "../../classes/event.ts";
import ContextCard from "./contextCard.tsx";
import {Dispatch, SetStateAction} from "react";
import ContextVariable from "../../classes/contextVariable.tsx";

export default function ContextCardDisplay(props: {vars: ContextVariable[], headerText: string | undefined, setVars: Dispatch<SetStateAction<ContextVariable[]>>, event?: Event}) {

    const headerText = () => props.headerText || "Display Context Variables";

    const filterVars = (event: Event) => {
        return props.vars.filter(variable => event.data.findIndex(v => v.name === variable.name));
    }

    return (
        <Accordion>
            <Accordion.Item eventKey={"0"}>
                <Accordion.Header>{headerText()}</Accordion.Header>
                <Accordion.Body>
                    {props.vars.length > 0 && props.event && (
                        <CardGroup>
                            {filterVars(props.event).map((v) => (
                                <ContextCard key={`${v.name}-card`} contextVariable={v} setVars={props.setVars} />
                            ))}
                        </CardGroup>
                    ) || props.vars.length > 0 && (
                        <CardGroup>
                            {props.vars.map((v) => (
                                <ContextCard key={`${v.name}-card`} contextVariable={v} setVars={props.setVars} />
                            ))}
                        </CardGroup>
                    )  ||(<h3 className={"text-muted"}>No Variables Selected</h3>)}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}
