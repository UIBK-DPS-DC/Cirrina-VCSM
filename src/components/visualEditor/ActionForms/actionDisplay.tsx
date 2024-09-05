import React, {useCallback, useEffect} from "react";

import {ActionType} from "../../../enums.ts";
import {renderEnumAsOptions} from "../../../utils.tsx";
import Action from "../../../classes/action.ts";
import RaiseEventActionForm from "./raiseEventActionForm.tsx";
import InvokeActionForm from "./invokeActionForm.tsx";
import CreateActionForm from "./createActionForm.tsx";
import AssignActionForm from "./assignActionForm.tsx";
import LockActionForm from "./lockActionForm.tsx";
import UnlockActionForm from "./unlockActionForm.tsx";
import TimeoutActionForm from "./timeoutActionForm.tsx";
import TimeoutResetActionForm from "./timeoutResetActionForm.tsx";
import {Form} from "react-bootstrap";

const ACTION_TYPE_SELECT_NAME = "action-type-select"

export default function ActionDisplay(props: {action: Action | undefined}) {
    const [selectedActionType, setSelectedActionType] = React.useState<string>(ActionType.INVOKE);

    const isDisabled = props.action !== undefined;

    const onSelectedActionTypeChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>)=> {
        setSelectedActionType(event.target.value);
    },[])

    useEffect(() => {
        if(props.action){
            setSelectedActionType(props.action.type);
        }
    }, []);




    return (
        <div>
            <Form.Group className={"mb-3"}>
                <Form.Label>Action Type</Form.Label>
            </Form.Group>
            <Form.Group className={"mb-3"}>
                <Form.Select disabled={isDisabled} onChange={onSelectedActionTypeChange} name={ACTION_TYPE_SELECT_NAME} value={selectedActionType} className={"mb-3"}>
                    {renderEnumAsOptions(ActionType)}
                </Form.Select>

                {selectedActionType && selectedActionType === ActionType.INVOKE && (
                    <InvokeActionForm action={props.action}></InvokeActionForm>
                )}

                {selectedActionType && selectedActionType === ActionType.CREATE && (
                    <CreateActionForm action={props.action}></CreateActionForm>
                )}

                {selectedActionType && selectedActionType === ActionType.ASSIGN && (
                    <AssignActionForm action={props.action}></AssignActionForm>
                )}

                {selectedActionType && selectedActionType === ActionType.LOCK && (
                    <LockActionForm action={props.action}></LockActionForm>
                )}

                {selectedActionType && selectedActionType === ActionType.UNLOCK && (
                    <UnlockActionForm action={props.action}></UnlockActionForm>
                )}

                {selectedActionType && selectedActionType === ActionType.RAISE_EVENT && (
                    <RaiseEventActionForm action={props.action}></RaiseEventActionForm>
                )}

                {selectedActionType && selectedActionType === ActionType.TIMEOUT && (
                    <TimeoutActionForm action={props.action}></TimeoutActionForm>
                )}

                {selectedActionType && selectedActionType === ActionType.TIMEOUT_RESET && (
                    <TimeoutResetActionForm action={props.action}></TimeoutResetActionForm>
                )}
            </Form.Group>



        </div>
    )
}
