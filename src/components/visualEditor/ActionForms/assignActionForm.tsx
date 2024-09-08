import Action from "../../../classes/action.ts";
import React, {Dispatch, SetStateAction, useCallback, useContext, useEffect, useState} from "react";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import SelectContextsModal from "../../Context/selectContextsModal.tsx";
import ContextVariable from "../../../classes/contextVariable.tsx";
import CreateContextFormModal from "../../Context/createContextFormModal.tsx";
import ContextCard from "../../Context/contextCard.tsx";
import {ReactFlowContext} from "../../../utils.tsx";
import {ReactFlowContextProps} from "../../../types.ts";

export default function AssignActionForm(props: {action: Action | undefined,
    setActions: Dispatch<SetStateAction<Action[]>>,
    onSubmit?: ()=> void}) {

    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {selectedNode} = context



    const [selectedVar, setSelectedVar] = React.useState<ContextVariable[]>([]);
    const [expressionInput, setExpressionInput] = useState<string>("");
    const [formIsValid, setFormIsValid] = useState<boolean>(false);

    const headerText = () => props.action ? "Edit Assign Action" : "Create Assign Action"
    const invalidExpressionFeedbackText = () => expressionInput ? "Input must be an expression" : "Field cant be empty"
    const submitButtonText = () => props.action ? "Save Changes" : "Create Action"

    const expressionIsValid  = (expression: string | undefined) => {
        if(!expression){
            return false;
        }

        // TODO: Implement logic to validate expressions
        return true
    }

    const onExpressionInputChange = (event: React.ChangeEvent<HTMLInputElement>) => setExpressionInput(event.target.value);

    const validateForm = () => {
        return expressionIsValid(expressionInput) && selectedVar.length === 1;
    }




    useEffect(() => {
        setFormIsValid(validateForm());
    }, [selectedVar, expressionInput]);


    const onContextSubmit = (newVar: ContextVariable) => {
        setSelectedVar((prevVars) => {
            const existingVar = prevVars.find((v) => v.name === newVar.name);
            if (existingVar) {
                existingVar.name = newVar.name;
                existingVar.value = newVar.value;
                return [...prevVars];
            } else {
                return [...prevVars, newVar];
            }
        })

    };

    const onActionSubmit = (newAction: Action) => {
        props.setActions((prevActions) => {
            const existingAction = prevActions.find((a) => a === newAction);

            if (existingAction) {
                // Update the properties of the existing variable (maintain reference)
                existingAction.properties = newAction.properties
                existingAction.type = newAction.type
                existingAction.context = newAction.context
                return [...prevActions];
            } else {
                // Add the new variable if it doesn't exist
                return [...prevActions, newAction];
            }
        });
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        event.stopPropagation()

        if(!selectedNode){
            return
        }


        if(props.action) {
            //TODO
        }
        else{

        }


        if(props.onSubmit){
            props.onSubmit()
        }

    }


    return (
      <Card className={"text-center"}>

          <Card.Header className={"mb-3"}>
              {headerText()}
          </Card.Header>

          <Card.Body>
              <Card.Title>
                  Action Properties
              </Card.Title>
              <Form validated={formIsValid}>
                  {!props.action && (
                      <Container>
                          <Form.Group as={Row} controlId={"formSelectAction"} className={"mb-3"}>
                              <Form.Label column sm={"4"}>
                                  Select Variable
                              </Form.Label>
                              <Col sm={4}>
                                  <SelectContextsModal buttonName={"Select Context"} vars={selectedVar} setVars={setSelectedVar} multiple={false}/>
                              </Col>
                              <Col>
                                  <CreateContextFormModal variable={undefined} buttonName={"Create"} onSubmit={onContextSubmit}/>
                              </Col>
                          </Form.Group>
                          {selectedVar.length > 0 && (
                              <ContextCard contextVariable={selectedVar[0]} setVars={setSelectedVar}/>
                          )}
                      </Container>
                  ) || (
                      <ContextCard contextVariable={selectedVar[0]} setVars={setSelectedVar} noRemove={true}/>
                  )}
                  <Form.Group as={Row} controlId={"formExpression"} className={"mb-3"}>
                      <Form.Label column sm={4}>Value:</Form.Label>
                      <Col sm={8}>
                          <Form.Control type={"text"}
                                        className={"mb-3"}
                                        isValid={expressionIsValid(expressionInput)}
                                        isInvalid={!expressionIsValid(expressionInput)}
                                        value={expressionInput} onChange={onExpressionInputChange}
                          />
                          <Form.Control.Feedback type={"invalid"}>
                              {invalidExpressionFeedbackText()}
                          </Form.Control.Feedback>
                      </Col>
                  </Form.Group>
                  <Button variant="primary" type="submit">
                      {submitButtonText()}
                  </Button>
              </Form>
          </Card.Body>

      </Card>
    )
}