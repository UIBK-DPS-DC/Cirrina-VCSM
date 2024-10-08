import {Dispatch, SetStateAction, useContext} from "react";
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import {ReactFlowContext} from "../../utils.tsx";
import {ReactFlowContextProps} from "../../types.ts";
import CreateContextFormModal from "./createContextFormModal.tsx";
import ContextVariable from "../../classes/contextVariable.tsx";
import Event from "../../classes/event.ts";

export default function ContextCard(props: {contextVariable: ContextVariable,
    setVars: Dispatch<SetStateAction<ContextVariable[]>>,
    noRegister?: boolean,
    noRemove?: boolean,
    deregisterOnRemove?: boolean,
    event?: Event,
    onEventEdit?: (event: Event) => void,
    onRemove?: (variable: ContextVariable) => void, noInfoText?: boolean}) {
    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {contextService} = context;

    const handleClick = () => {
        props.setVars(prevState => prevState.filter(v => v !== props.contextVariable));
        if(props.event) {
            props.event.data =  props.event.data.filter(v => v !== props.contextVariable)

            if(props.onEventEdit){
                props.onEventEdit(props.event)
            }


        }

        if(props.deregisterOnRemove){
            contextService.deregisterContextByName(props.contextVariable.name)
        }

        if(props.onRemove){
            props.onRemove(props.contextVariable);
        }
    };

    // Callback for handling when the context variable is edited
    const handleContextEdit = (updatedVariable: ContextVariable) => {
        props.setVars(prevState =>
            prevState.map(v => v.name === updatedVariable.name ? updatedVariable : v)
        );
    };

    const footerText = () => contextService.getLinkedState(props.contextVariable)?
        `${props.contextVariable.name} is a ${contextService.getContextType(props.contextVariable)?.toLowerCase()} variable in ${contextService.getLinkedState(props.contextVariable)?.name}`
        : `${props.contextVariable.name} has not been created yet.`



    return (
        <Container key={`c-${props.contextVariable?.name}`}>
            {props.contextVariable && (
                <Card border={"info"} className={"mb-3"}>
                    <Card.Body>
                        <Card.Title>{props.contextVariable.name}</Card.Title>
                        <Card.Text>Value: {props.contextVariable.value}</Card.Text>
                    </Card.Body>
                    <Card.Footer className="text-muted">
                        {!props.noInfoText && (
                            <Card.Text>{footerText()}</Card.Text>
                        )}
                        <Row>

                            <Col sm={3}>
                                <CreateContextFormModal variable={props.contextVariable} buttonName={"Edit"} onSubmit={handleContextEdit} noRegister={props.noRegister}/>
                            </Col>

                            <Col sm={3}>
                                {!props.noRemove &&(
                                    <Button variant={"danger"} className={"right"} onClick={handleClick}>Remove</Button>
                                )}
                            </Col>

                        </Row>

                    </Card.Footer>
                </Card>
            )}
        </Container>
    );
}
