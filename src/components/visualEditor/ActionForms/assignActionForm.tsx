import Action from "../../../classes/action.ts";
import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import SelectContextsModal from "../../Context/selectContextsModal.tsx";
import ContextVariable from "../../../classes/contextVariable.tsx";
import CreateContextFormModal from "../../Context/createContextFormModal.tsx";
import ContextCard from "../../Context/contextCard.tsx";
import {ReactFlowContext, renderEnumAsOptions} from "../../../utils.tsx";
import {AssignActionProps, isState, ReactFlowContextProps} from "../../../types.ts";
import {ActionCategory, ActionType} from "../../../enums.ts";

export default function AssignActionForm(props: {action: Action | undefined,
    setActions: Dispatch<SetStateAction<Action[]>>,
    onSubmit?: ()=> void,
    noCategorySelect?: boolean
    , dontAddToState? :boolean,
    dontShowDeleteButton? :boolean}) {

    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {selectedNode,stateOrStateMachineService,
    actionService} = context



    const [selectedVar, setSelectedVar] = React.useState<ContextVariable[]>([]);
    const [expressionInput, setExpressionInput] = useState<string>("");
    const [formIsValid, setFormIsValid] = useState<boolean>(false);
    const [selectedActionCategory, setSelectedActionCategory] = useState<string>(ActionCategory.ENTRY_ACTION)


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
    const onSelectedActionCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedActionCategory(event.target.value);
    }


    const validateForm = () => {
        return expressionIsValid(expressionInput) && selectedVar.length === 1;
    }




    useEffect(() => {
        setFormIsValid(validateForm());
    }, [selectedVar, expressionInput]);

    useEffect(() => {
        if(!selectedNode){
            return
        }

        if(props.action){
            const assignActionsProps = props.action.properties as AssignActionProps;
            setSelectedVar([assignActionsProps.variable]);
            setExpressionInput(assignActionsProps.expression);

            const actionCategory = actionService.getActionCategory(props.action,selectedNode.data)
            if(actionCategory) {
                setSelectedActionCategory(actionCategory)
            }

        }

    }, []);


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

    const onDeleteButtonPress = () => {

        if(!selectedNode){
            return;
        }

        if(!props.action){
            return
        }

        stateOrStateMachineService.removeActionFromState(props.action, selectedNode.data)
        props.setActions((prevActions) => prevActions.filter((a) => a !== props.action))

    }

    const onRemove = () => {
        setSelectedVar([])
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        event.stopPropagation()

        if(!selectedNode){
            return
        }

        const assignActionsProps: AssignActionProps = {
            expression: expressionInput,
            type: ActionType.ASSIGN,
            variable: selectedVar[0]
        }

        let updatedAction: Action




        if (props.action) {

            const oldCategory = actionService.getActionCategory(props.action, selectedNode.data);

            // Check if category has changed and update the action in the state node if needed
            if (oldCategory !== selectedActionCategory as ActionCategory) {
                if(!props.dontAddToState){
                    stateOrStateMachineService.removeActionFromState(props.action, selectedNode.data);
                    stateOrStateMachineService.addActionToState(selectedNode.data, props.action, selectedActionCategory as ActionCategory);
                }
            }

            updatedAction = props.action;
            updatedAction.properties = assignActionsProps;
            onActionSubmit(updatedAction);
        } else {
            updatedAction = new Action("newAction", ActionType.ASSIGN);
            updatedAction.properties = assignActionsProps;
            if(!props.dontAddToState){
                stateOrStateMachineService.addActionToState(selectedNode.data, updatedAction, selectedActionCategory as ActionCategory);
            }
            onActionSubmit(updatedAction);
        }

        if (props.onSubmit) {
            props.onSubmit();
        }


        actionService.deregisterAction(updatedAction);
        actionService.registerAction(updatedAction);

        if(isState(selectedNode.data)){
            const sm = selectedNode.data
            sm.state.entry.forEach(entry => {
                console.log(entry.properties)
            })
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
              <Form validated={formIsValid} onSubmit={onSubmit}>
                  {(!props.action || (props.action && selectedVar.length < 1)) &&  (
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
                      <ContextCard contextVariable={selectedVar[0]} setVars={setSelectedVar} onRemove={onRemove}/>
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
                  {!props.noCategorySelect && (
                      <Form.Group className={"mb-3"}>
                          <Form.Label>Action Category</Form.Label>
                          <Form.Select onChange={onSelectedActionCategoryChange} value={selectedActionCategory} className={"mb-3"}>
                              {renderEnumAsOptions(ActionCategory)}
                          </Form.Select>
                      </Form.Group>
                  )}


                  {props.action && !props.dontShowDeleteButton && (
                      <Row className={"mb-3"}>
                          <Col sm={6}>
                              <Button type={"submit"} disabled={!formIsValid}>{submitButtonText()}</Button>
                          </Col>
                          <Col sm={6}>
                              <Button variant={"danger"} onClick={onDeleteButtonPress}>Delete</Button>
                          </Col>
                      </Row>
                  ) || (
                      <Button variant="primary" type="submit" disabled={!formIsValid}>
                          {submitButtonText()}
                      </Button>
                  )}

              </Form>
          </Card.Body>

      </Card>
    )
}