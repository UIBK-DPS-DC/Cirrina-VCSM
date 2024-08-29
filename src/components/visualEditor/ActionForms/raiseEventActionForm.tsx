import Action from "../../../classes/action.ts";

export default function RaiseEventActionForm(props: {action: Action | undefined}) {

    return(
        <div className={"action-form-container"}>
            <h2>
                This is a RaiseEvent
            </h2>
        </div>
    )
}