import Action from "../../../classes/action.ts";

export default function CreateActionForm(props: {action: Action | undefined}) {
    return(
        <div className={"action-form-container"}>
            <h2>This is a create action</h2>
        </div>
    )
}