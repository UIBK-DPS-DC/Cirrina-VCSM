import {Accordion, CardGroup} from "react-bootstrap";
import Event from "../../classes/event.ts";
import ContextCard from "./contextCard.tsx";
import {Dispatch, SetStateAction} from "react";
import ContextVariable from "../../classes/contextVariable.tsx";
import { useEffect } from "react";

export default function ContextCardDisplay(props: {vars: ContextVariable[],
    headerText: string | undefined,
    setVars: Dispatch<SetStateAction<ContextVariable[]>>,
    event?: Event,
    onEventEdit?: (event: Event) => void,
    onRemove? : (variable: ContextVariable) => void,
    deregisterOnRemove?: boolean,
    noInfoText?: boolean}) {

    const headerText = () => props.headerText || "Display Context Variables";

    const filterVars = (event: Event) => {
        return props.vars.filter(variable => event.data.findIndex(v => v.name === variable.name) >= 0);
    };



    useEffect(() => {
        console.log("CONTEXT-CARD-DISPLAY: Vars updated:", props.vars);
    }, [props.vars]);

    useEffect(() => {
        console.log("CONTEXT-CARD-DISPLAY: Event updated:", props.event);
    }, [props.event]);




    return (
        <Accordion>
            <Accordion.Item eventKey={"0"}>
                <Accordion.Header>{headerText()}</Accordion.Header>
                <Accordion.Body>
                    {props.vars.length > 0 && props.event && (
                        <CardGroup>
                            {filterVars(props.event).map((v) => (
                                <ContextCard key={`${v.name}-card`} contextVariable={v} setVars={props.setVars} event={props.event} onEventEdit={props.onEventEdit} noInfoText={props.noInfoText} />
                            ))}
                        </CardGroup>
                    ) || props.vars.length > 0 && (
                        <CardGroup>
                            {props.vars.map((v) => (
                                <ContextCard key={`${v.name}-card`} contextVariable={v} setVars={props.setVars} onRemove={props.onRemove} deregisterOnRemove={props.deregisterOnRemove} noInfoText={props.noInfoText}/>
                            ))}
                        </CardGroup>
                    )  ||(<h3 className={"text-muted"}>No Variables Selected</h3>)}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}
