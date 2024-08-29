import Action from "../../../classes/action.ts";

export default function InvokeActionForm(props: {action: Action | undefined}) {

    return(
        <div className={"action-form-container"}>
            <h2>This is an invoke Action</h2>
        </div>
    )

}