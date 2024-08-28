import React, {useCallback, useContext} from "react";
import {ReactFlowContext} from "../../../utils.ts";
import {ReactFlowContextProps} from "../../../types.ts";
import {ActionType} from "../../../enums.ts";
import {renderEnumAsOptions} from "../../../utils.tsx";

const ACTION_TYPE_SELECT_NAME = "action-type-select"

export default function ActionTypeSelect() {
    const [selectedActionType, setSelectedActionType] = React.useState<string>(ActionType.RAISE_EVENT);

    const onSelectedActionTypeChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>)=> {
        setSelectedActionType(event.target.value);
    },[])

    return (
        <div>
            <h2>Action select wip</h2>
            <select id={ACTION_TYPE_SELECT_NAME} name={ACTION_TYPE_SELECT_NAME} value={selectedActionType} onChange={onSelectedActionTypeChange}>
                {renderEnumAsOptions(ActionType)}
            </select>
            {selectedActionType && selectedActionType == ActionType.RAISE_EVENT && (
                <h1>Raise event mfs</h1>
            )}
        </div>
    )


}