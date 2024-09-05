import {Dispatch, SetStateAction, useContext, useEffect} from "react";
import {Button, Card, Container} from "react-bootstrap";
import {ReactFlowContext} from "../../utils.tsx";
import {ReactFlowContextProps} from "../../types.ts";
import CreateContextFormModal from "./createContextFormModal.tsx";

export default function ContextCard(props: {contextVariable: string, setVars: Dispatch<SetStateAction<string[]>>}) {
    const context = useContext(ReactFlowContext) as ReactFlowContextProps
    const {contextService} = context

    const contextVariable = contextService.getContextByName(props.contextVariable);

    const handleClick = () => {
        if(!contextVariable) {
            return
        }
        props.setVars((prevState) => {
            return prevState.filter((v) => v !== contextVariable?.name)
        })
    }

    const footerText = () => contextVariable ? `${contextVariable.name} is a ${contextService.getContextType(contextVariable)?.toLowerCase()} variable in ${contextService.getLinkedState(contextVariable)?.name}` : ""

    return(
        <Container key={`c-${contextVariable?.name}`}>
            {contextVariable && (
                <Card border={"info"} className={"mb-3"}>
                    <Card.Body>
                        <Card.Title>{contextVariable.name}</Card.Title>
                        <Card.Text>Value: {contextVariable.value}</Card.Text>

                    </Card.Body>
                    <Card.Footer className="text-muted">
                        <Card.Text>{footerText()}</Card.Text>
                        <CreateContextFormModal variable={contextVariable} buttonName={"Edit"}></CreateContextFormModal>
                        <Button variant={"danger"} className={"right"} onClick={handleClick}>Remove</Button>
                    </Card.Footer>
                </Card>

            )}
        </Container>
    )

}