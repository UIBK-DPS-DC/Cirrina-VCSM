import Action from "../../../classes/action.ts";

export default function TimeoutResetActionForm(props: {action: Action | undefined}) {
    return(
        <div className={"action-form-container"}>
            <h2>This is a TimeoutReset Action</h2>
        </div>
    )
}