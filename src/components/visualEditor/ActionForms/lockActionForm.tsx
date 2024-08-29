import Action from "../../../classes/action.ts";

export default function LockActionForm(props: {action: Action | undefined}) {
    return(
        <div className={"action-form-container"}>
            <h2>This is a Lock Action</h2>
        </div>
    )
}