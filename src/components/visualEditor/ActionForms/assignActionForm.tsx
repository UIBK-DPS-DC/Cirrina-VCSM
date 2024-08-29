import Action from "../../../classes/action.ts";

export default function AssignActionForm(props: {action: Action | undefined}) {
    return(
        <div className={"action-form-container"}>
            <h2>This is an assign Action</h2>
        </div>
    )
}