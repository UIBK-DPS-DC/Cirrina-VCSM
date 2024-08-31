import ContextVariable from "../../classes/contextVariable.tsx";
import {ChangeEvent, useContext, useState} from "react";
import {ReactFlowContext} from "../../utils.tsx";
import {ReactFlowContextProps} from "../../types.ts";
import {Button, Form} from "react-bootstrap";


export default function ContextForm(props: {variable: ContextVariable | undefined}) {

    const VARIABLE_NAME_FIELD_NAME = "variable-name"
    const EXPRESSION_FIELD_NAME = "expression"
    const CONTEXT_TYPE_FIELD_NAME = "contextType"

    const buttonText = () => props.variable ? "Update Variable" : "Create Variable"


    const EXPRESSION_INFO_LINK = "https://en.wikipedia.org/wiki/Expression_(computer_science)";
    const SPECIFICATIONS_LINK = "https://github.com/UIBK-DPS-DC/Cirrina-Specifications/blob/develop/SPECIFICATIONS.md#data-model-manipulation-and-scope"

    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {selectedNode} = context

    const [variableNameInput, setVariableNameInput] = useState<string>("");
    const [variableValueInput, setVariableValueInput] = useState<string>("");
    const [contextTypeValue, setContextTypeValue] = useState<string>("");

    const onVariableNameInputChange = (event: ChangeEvent<HTMLInputElement>) => setVariableNameInput(event.target.value);
    const onVariableValueInputChange = (event: ChangeEvent<HTMLInputElement>) => setVariableValueInput(event.target.value);
    const onContextTypeValueChange = (event: ChangeEvent<HTMLSelectElement>) => setContextTypeValue(event.target.value);






    return(
        <Form>
            <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control type={"text"} name={VARIABLE_NAME_FIELD_NAME} placeholder={"Variable Name"} value={variableNameInput} onChange={onVariableNameInputChange} required />
                <Form.Text className={"text-muted"}>
                    The new Variable's Name
                </Form.Text>
            </Form.Group>

            <Form.Group>
                <Form.Label>Value</Form.Label>
                <Form.Control type={"text"} name={EXPRESSION_FIELD_NAME} placeholder={"Value"} value={variableValueInput} onChange={onVariableValueInputChange} required/>
                <Form.Text className={"text-muted"}>
                    The variables value. Must be an <a href={EXPRESSION_INFO_LINK} target={"_blank"}>Expression</a>
                </Form.Text>
            </Form.Group>

            <Form.Group>
                <Form.Label>Context Type</Form.Label>
                <Form.Select name={CONTEXT_TYPE_FIELD_NAME} value={contextTypeValue} onChange={onContextTypeValueChange}>
                    <option> Test</option>
                </Form.Select>
                <Form.Text className={"text-muted"}>
                    The Context Type of the variable affects its visibility. See the <a href={SPECIFICATIONS_LINK} target={"_blank"}>Specification</a>
                </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
                {buttonText()}
            </Button>
        </Form>
    )


}