import {useContext} from "react";
import {ReactFlowContext} from "../../utils.tsx";
import {ReactFlowContextProps} from "../../types.ts";
import Offcanvas from "react-bootstrap/Offcanvas";
import {OffcanvasBody, OffcanvasHeader, OffcanvasTitle} from "react-bootstrap";


export default function TransitionInfoForm() {
    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {selectedEdge, showSidebar, setShowSidebar} = context

    const offcanvasTitle = () => selectedEdge?.data ?
        selectedEdge.data.transition.getSource() + " => " + selectedEdge.data.transition.getTarget() : "Unknown"

    return (
        <>
            {showSidebar && selectedEdge && selectedEdge.data && (
                <Offcanvas show={showSidebar}
                           scroll={true} backdrop={false}
                           placement={"end"}
                           style={{ width: '30vw' }}>

                    <OffcanvasHeader closeButton={true} onClick={() => {setShowSidebar(false)}}>
                        <OffcanvasTitle>
                            {offcanvasTitle()}
                        </OffcanvasTitle>
                    </OffcanvasHeader>

                    <OffcanvasBody>
                        Transition form
                    </OffcanvasBody>

                </Offcanvas>
            )}
        </>
    )




}