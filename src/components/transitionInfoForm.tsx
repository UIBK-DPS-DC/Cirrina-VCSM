import {ReactFlowContext} from "./flow.tsx";
import {useContext} from "react";
import {ReactFlowContextProps} from "../types.ts";



export default function TransitionInfoForm() {
        const context = useContext(ReactFlowContext) as ReactFlowContextProps;
        const {
            selectedEdge,
            showSidebar,
        } = context;







        return(
            showSidebar && selectedEdge && selectedEdge.data &&(
            <div className="edge-form">
                <form>
                    <h3>Hi dad! Its me {selectedEdge.id}</h3>
                    <h2>I connect {selectedEdge.data.transition.getSource()} to {selectedEdge.data.transition.getTarget()}</h2>
                </form>
            </div>
        ))



}