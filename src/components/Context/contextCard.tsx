import {Dispatch, SetStateAction, useContext} from "react";
import {Button, Card, Container} from "react-bootstrap";
import {ReactFlowContext} from "../../utils.tsx";
import {ReactFlowContextProps} from "../../types.ts";

export default function ContextCard(props: {contextName: string, setVars: Dispatch<SetStateAction<string[]>>}) {
    const context = useContext(ReactFlowContext) as ReactFlowContextProps
    const {contextService} = context

    const contextVariable = contextService.getContextByName(props.contextName);

    const handleClick = () => {
        if(!contextVariable) {
            return
        }
        props.setVars((prevState) => {
            return prevState.filter((v) => v !== contextVariable?.name)
        })
    }

    const footerText = () => contextVariable ? `${contextVariable.name} is a ${contextService.getContextType(contextVariable)} variable in ${contextService.getLinkedState(contextVariable)?.name}` : ""

    return(
        <Container>
            {contextVariable && (
                <Card border={"info"} className={"mb-3"}>
                    <Card.Header>{contextVariable.name}</Card.Header>
                    <Card.Body>
                        <Card.Title>{contextVariable.name}</Card.Title>
                        <Card.Text>Value: {contextVariable.value}</Card.Text>
                    </Card.Body>
                    <Card.Footer className="text-muted">
                        <Card.Text>{footerText()}</Card.Text>
                        <Button variant={"danger"} className={"right"} onClick={handleClick}>Remove</Button>
                    </Card.Footer>
                </Card>

            )}
        </Container>
    )

}