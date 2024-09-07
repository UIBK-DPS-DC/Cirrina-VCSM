import Action from "../../../classes/action.ts";
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import CreateContextFormModal from "../../Context/createContextFormModal.tsx";
import React, {useEffect, useState} from "react";
import ContextVariable from "../../../classes/contextVariable.tsx";
import ContextCard from "../../Context/contextCard.tsx";

export default function CreateActionForm(props: {action: Action | undefined}) {

    const cardHeaderText = () => props.action ? "Edit Create Action" : "New Create Action"
    const submitButtonText = () => props.action ? "Update Action" : "Create Action"

    const [variableToBeCreated, setVariableToBeCreated] = useState<ContextVariable[]>([]);
    const [variableIsPersistent, setVariableIsPersistent] = useState<boolean>(false);
    const [formIsValid,setFormIsValid] = useState<boolean>(false);


    const onVariableIsPersistentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVariableIsPersistent(event.currentTarget.checked);
    }

    const onVariableCreate = (variable: ContextVariable): void => {
        setVariableToBeCreated([variable]);
    }

    const validateForm = () => {
        setFormIsValid(variableToBeCreated.length === 1);
    }

    useEffect(() => {
        validateForm();
    }, [variableToBeCreated]);

    useEffect(() => {
        console.log(`Creating ${variableToBeCreated.toString()}`);
    }, [variableToBeCreated, setVariableToBeCreated]);

    return(
        <Card className={"text-center"}>
            <Card.Header>
                {cardHeaderText()}
            </Card.Header>

            <Card.Body>
                <Card.Title>Action Properties</Card.Title>
                <Form validated={formIsValid}>
                    {variableToBeCreated.length < 1 && (
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={"6"}>Variable  to be created:</Form.Label>
                            <Col sm={6}>
                                <CreateContextFormModal variable={variableToBeCreated[0]} buttonName={"Create"} onSubmit={onVariableCreate} noRegister={true}>
                                </CreateContextFormModal>
                            </Col>
                        </Form.Group>
                    )}

                    {variableToBeCreated.length > 0 && (
                        <Form.Group className={"mb-3"}>
                            <Form.Label className={"mb-3"}>Variable to be created</Form.Label>
                            <ContextCard contextVariable={variableToBeCreated[0]} setVars={setVariableToBeCreated} noRegister={true}/>
                        </Form.Group>
                    )}

                    <Form.Group className={"mb-3 d-flex align-items-center"} controlId={"formIsLocal"}>
                        <Form.Label className={"me-3 mb-0 ms-3"}>Is Persistent</Form.Label>
                        <Form.Check type={"checkbox"} checked={variableIsPersistent} onChange={onVariableIsPersistentChange}/>
                    </Form.Group>

                    {/* Warning message if form is not valid */}
                    {!formIsValid && (
                        <div className="text-danger mb-3">
                           Create Action needs to create a Variable
                        </div>
                    )}

                    <Button type={"submit"} disabled={!formIsValid}>{submitButtonText()}</Button>

                </Form>
            </Card.Body>
        </Card>
    )
}
