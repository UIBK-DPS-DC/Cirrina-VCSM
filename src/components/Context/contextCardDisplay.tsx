import {Accordion} from "react-bootstrap";

export default function ContextCardDisplay(props: {vars: string[], headerText: string | undefined}) {

    const headerText = () => props.headerText || "Display Context Variables"

    return(
        <Accordion>
            <Accordion.Item eventKey={"0"}>
                <Accordion.Header>{headerText()}</Accordion.Header>
                <Accordion.Body>
                    {props.vars.map((v) => {
                        return (
                            <h3>{v}</h3>
                        )
                    })}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}