import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo } from "react";
import { ActionType } from "../../../enums.ts";
import { renderEnumAsOptions } from "../../../utils.tsx";
import Action from "../../../classes/action.ts";
import RaiseEventActionForm from "./raiseEventActionForm.tsx";
import InvokeActionForm from "./invokeActionForm.tsx";
import CreateActionForm from "./createActionForm.tsx";
import AssignActionForm from "./assignActionForm.tsx";
import LockActionForm from "./lockActionForm.tsx";
import UnlockActionForm from "./unlockActionForm.tsx";
import TimeoutActionForm from "./timeoutActionForm.tsx";
import TimeoutResetActionForm from "./timeoutResetActionForm.tsx";
import { Form } from "react-bootstrap";

const ACTION_TYPE_SELECT_NAME = "action-type-select";

export default function ActionDisplay(props: {
    action: Action | undefined,
    setInvokeActions: Dispatch<SetStateAction<Action[]>>,
    setCreateActions: Dispatch<SetStateAction<Action[]>>,
    setAssignActions: Dispatch<SetStateAction<Action[]>>,
    setRaiseEventActions: Dispatch<SetStateAction<Action[]>>
    onSubmit?: () => void
}) {
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
            case ActionType.LOCK:
                return <LockActionForm action={props.action} />;
            case ActionType.UNLOCK:
                return <UnlockActionForm action={props.action} />;
            case ActionType.RAISE_EVENT:
                return <RaiseEventActionForm action={props.action} setActions={props.setRaiseEventActions} onSubmit={props.onSubmit} />;
            case ActionType.TIMEOUT:
                return <TimeoutActionForm action={props.action} />;
            case ActionType.TIMEOUT_RESET:
                return <TimeoutResetActionForm action={props.action} />;
            default:
                return null;
        }
    }, [selectedActionType, props.action, props.setCreateActions, props.setAssignActions, props.setInvokeActions, props.onSubmit]);

    return (
        <div>
            <Form.Group className={"mb-3 mt-3"}>
                <Form.Label>Action Type</Form.Label>
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
