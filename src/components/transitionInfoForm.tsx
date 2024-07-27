import {ReactFlowContext} from "./flow.tsx";
import {useContext} from "react";
import {ReactFlowContextProps} from "../types.ts";



export default function TransitionInfoForm() {
        const context = useContext(ReactFlowContext) as ReactFlowContextProps;
        const {
            selectedTransition,
            showSidebar,
        } = context;







        return(
            showSidebar && selectedTransition && (
            <div className="edge-form">
                <form>
                    <h3>Hi dad! Its me {selectedTransition.id}</h3>
                </form>
            </div>
        ))



}