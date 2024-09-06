import Action from "../../../classes/action.ts";
import {Card, Col, Form, Row} from "react-bootstrap";
import {ServiceType} from "../../../enums.ts";
import {ReactFlowContext, renderEnumAsOptions} from "../../../utils.tsx";
import {useContext, useState} from "react";
import {ReactFlowContextProps} from "../../../types.ts";
import CreateContextFormModal from "../../Context/createContextFormModal.tsx";
import SelectContextsModal from "../../Context/selectContextsModal.tsx";
import ContextCardDisplay from "../../Context/contextCardDisplay.tsx";
import ContextVariable from "../../../classes/contextVariable.tsx";

export default function InvokeActionForm(props: {action: Action | undefined}) {
    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {contextService} = context;



    // Selected variables
    const [selectedInputContextVariables, setSelectedInputContextVariables] = useState<ContextVariable[]>([]);

    const onSubmit = (newVar: ContextVariable) => {
        setSelectedInputContextVariables((prevVars) => {
            const existingVar = prevVars.find((v) => v.name === newVar.name);

            if (existingVar) {
                // Update the properties of the existing variable (maintain reference)
                existingVar.name = newVar.name;
                existingVar.value = newVar.value;
                return [...prevVars];
            } else {
                // Add the new variable if it doesn't exist
                return [...prevVars, newVar];
            }
        });
    }

    const cardHeaderText = () => props.action ? "Edit Invoke Action" : "Create new Invoke Action";

    return (
        <Card className={"text-center"}>
            <Card.Header>
                {cardHeaderText()}
            </Card.Header>
            <Card.Body>
                <Card.Title>Action Properties</Card.Title>
                <Form>
                    <Form.Group as={Row} className="mb-3" controlId="formServiceType">
                        <Form.Label column sm="3" className="text-sm-end">
                            ServiceType
                        </Form.Label>
                        <Col sm="9">
                            <Form.Select>
                                {renderEnumAsOptions(ServiceType)}
                            </Form.Select>
                            <Form.Text className="text-muted">
                                The Actions Service Type
                            </Form.Text>
                        </Col>
                    </Form.Group>

                    <Form.Group className={"mb-3 d-flex align-items-center"} controlId={"formIsLocal"}>
                        <Form.Label className="me-3 mb-0 ms-3">Service is local</Form.Label>
                        <Form.Check type="checkbox" />
                    </Form.Group>

                    <Form.Group as={Row} className={"mb-3"} controlId={"fromInputVariables"}>
                        <Form.Label column sm="3" className="mb-0">Input</Form.Label>
                        <Col sm="5">
                            <SelectContextsModal buttonName={"Select Variables"} vars={selectedInputContextVariables} setVars={setSelectedInputContextVariables} />
                        </Col>
                        <Col sm={4}>
                            <CreateContextFormModal variable={undefined} buttonName={"Create New"} onSubmit={onSubmit} />
                        </Col>
                    </Form.Group>

                    <Form.Group>
                        <ContextCardDisplay vars={selectedInputContextVariables} headerText={"Selected Input Vars"} setVars={setSelectedInputContextVariables} />
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>
    );
}
