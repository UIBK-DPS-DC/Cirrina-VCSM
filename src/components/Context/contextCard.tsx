import {Dispatch, SetStateAction, useContext} from "react";
import {Button, Card, Container} from "react-bootstrap";
import {ReactFlowContext} from "../../utils.tsx";
import {ReactFlowContextProps} from "../../types.ts";
import CreateContextFormModal from "./createContextFormModal.tsx";
import ContextVariable from "../../classes/contextVariable.tsx";

export default function ContextCard(props: {contextVariable: ContextVariable, setVars: Dispatch<SetStateAction<ContextVariable[]>>}) {
    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {contextService} = context;

    const handleClick = () => {
        props.setVars(prevState => prevState.filter(v => v !== props.contextVariable));
    };

    // Callback for handling when the context variable is edited
    const handleContextEdit = (updatedVariable: ContextVariable) => {
        props.setVars(prevState =>
            prevState.map(v => v.name === updatedVariable.name ? updatedVariable : v)
        );
    };

    const footerText = () => `${props.contextVariable.name} is a ${contextService.getContextType(props.contextVariable)?.toLowerCase()} variable in ${contextService.getLinkedState(props.contextVariable)?.name}`;



    return (
        <Container key={`c-${props.contextVariable?.name}`}>
            {props.contextVariable && (
                <Card border={"info"} className={"mb-3"}>
                    <Card.Body>
                        <Card.Title>{props.contextVariable.name}</Card.Title>
                        <Card.Text>Value: {props.contextVariable.value}</Card.Text>
                    </Card.Body>
                    <Card.Footer className="text-muted">
                        <Card.Text>{footerText()}</Card.Text>
                        <CreateContextFormModal variable={props.contextVariable} buttonName={"Edit"} onSubmit={handleContextEdit} />
                        <Button variant={"danger"} className={"right"} onClick={handleClick}>Remove</Button>
                    </Card.Footer>
                </Card>
            )}
        </Container>
    );
}
