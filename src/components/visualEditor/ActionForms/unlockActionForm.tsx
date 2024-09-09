import Action from "../../../classes/action.ts";

export default function UnlockActionForm(props: {action: Action | undefined}) {
    return(
        <div className={"action-form-container"}>
            <h2>This is an unlock Action</h2>
        </div>
    )
}