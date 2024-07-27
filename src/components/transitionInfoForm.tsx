import {ReactFlowContext} from "./flow.tsx";
import {useContext} from "react";
import {ReactFlowContextProps} from "../types.ts";



export default function TransitionInfoForm() {
        const context = useContext(ReactFlowContext) as ReactFlowContextProps;


        return(
            <div>
                <p>This is the transition info form for</p>
            </div>
        )



}