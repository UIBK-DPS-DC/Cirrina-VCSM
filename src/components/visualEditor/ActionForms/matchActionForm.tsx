import Action from "../../../classes/action.ts";
import React, {SetStateAction} from "react";

export default function MatchActionForm(props: {action: Action | undefined, setActions: React.Dispatch<SetStateAction<Action[]>>}) {

    console.log('matchActionForm', props)



    return(
        <h2>This is a match action form</h2>
    )
}