import React, {useCallback, useContext} from "react";

import {ActionType} from "../../../enums.ts";
import {ReactFlowContext, renderEnumAsOptions} from "../../../utils.tsx";
import {ReactFlowContextProps} from "../../../types.ts";

const ACTION_TYPE_SELECT_NAME = "action-type-select"

export default function ActionTypeSelect() {
    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
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