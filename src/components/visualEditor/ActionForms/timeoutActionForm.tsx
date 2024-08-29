import Action from "../../../classes/action.ts";

export default function TimeoutActionForm(props: {action: Action | undefined}) {
    return(
        <div className={"action-form-container"}>
            <h2>This is a Timeout Action</h2>
        </div>
    )
}