import React, {Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo} from "react";
import { ActionType } from "../../enums.ts";
import {ReactFlowContext, renderEnumAsOptions} from "../../utils.tsx";
import Action from "../../classes/action.tsx";
import RaiseEventActionForm from "../visualEditor/ActionForms/raiseEventActionForm.tsx";
import InvokeActionForm from "../visualEditor/ActionForms/invokeActionForm.tsx";
import CreateActionForm from "../visualEditor/ActionForms/createActionForm.tsx";
import AssignActionForm from "../visualEditor/ActionForms/assignActionForm.tsx";
import TimeoutActionForm from "../visualEditor/ActionForms/timeoutActionForm.tsx";
import TimeoutResetActionForm from "../visualEditor/ActionForms/timeoutResetActionForm.tsx";
import { Form } from "react-bootstrap";
import MatchActionForm from "../visualEditor/ActionForms/matchActionForm.tsx";
import {ReactFlowContextProps} from "../../types.ts";

const ACTION_TYPE_SELECT_NAME = "action-type-select";

export default function ActionDisplay(props: {
    action: Action | undefined,
    setInvokeActions: Dispatch<SetStateAction<Action[]>>,
    setCreateActions: Dispatch<SetStateAction<Action[]>>,
    setAssignActions: Dispatch<SetStateAction<Action[]>>,
    setRaiseEventActions: Dispatch<SetStateAction<Action[]>>,
    setTimeoutActions: Dispatch<SetStateAction<Action[]>>,
    setTimeoutResetActions: Dispatch<SetStateAction<Action[]>>,
    setMatchActions: Dispatch<SetStateAction<Action[]>>,
    onSubmit?: () => void
}) {

    const context = useContext(ReactFlowContext) as ReactFlowContextProps
    const {darkMode} = context
    const [selectedActionType, setSelectedActionType] = React.useState<string>(ActionType.INVOKE);

    const isDisabled = props.action !== undefined;

    // Handle action type change
    const onSelectedActionTypeChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedActionType(event.target.value);
    }, []);

    // Set the action type when props.action is present
    useEffect(() => {
        if (props.action) {
            setSelectedActionType(props.action.type);
        }
    }, [props.action]);

    // Memoized rendering logic for the selected form
    const renderActionForm = useMemo(() => {
        switch (selectedActionType) {
            case ActionType.INVOKE:
                return <InvokeActionForm action={props.action} setActions={props.setInvokeActions} onSubmit={props.onSubmit} />;
            case ActionType.CREATE:
                return <CreateActionForm action={props.action} setActions={props.setCreateActions} onSubmit={props.onSubmit} />;
            case ActionType.ASSIGN:
                return <AssignActionForm action={props.action} setActions={props.setAssignActions} onSubmit={props.onSubmit} />;
            case ActionType.RAISE_EVENT:
                return <RaiseEventActionForm action={props.action} setActions={props.setRaiseEventActions} onSubmit={props.onSubmit} />;
            case ActionType.TIMEOUT:
                return <TimeoutActionForm action={props.action} setActions={props.setTimeoutActions} onSubmit={props.onSubmit}/>;
            case ActionType.TIMEOUT_RESET:
                return <TimeoutResetActionForm action={props.action} setActions={props.setTimeoutResetActions} onSubmit={props.onSubmit} />;
            case ActionType.MATCH:
                return <MatchActionForm action={props.action} setActions={props.setMatchActions} onSubmit={props.onSubmit}/>
            default:
                return null;
        }
    }, [selectedActionType, props.action, props.setCreateActions, props.setAssignActions, props.setInvokeActions, props.onSubmit]);

    return (
        <div>
            <Form.Group className={"mb-3 mt-3"}>
                <Form.Label style={{color: darkMode ? "#ffffff" : "#000000", textAlign: "center"}}>Action Type</Form.Label>
                <Form.Select
                    disabled={isDisabled}
                    onChange={onSelectedActionTypeChange}
                    name={ACTION_TYPE_SELECT_NAME}
                    value={selectedActionType}
                    className={"mb-3"}
                >
                    {renderEnumAsOptions(ActionType)}
                </Form.Select>

                {renderActionForm}
            </Form.Group>
        </div>
    );
}
