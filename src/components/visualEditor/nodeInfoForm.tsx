import React, {useCallback, useContext, useState} from "react";
import { isState, ReactFlowContextProps} from "../../types.ts";
import Action from "../../classes/action.ts";
import {ReactFlowContext} from "../../utils.tsx";
import RenameNodeComponent from "./renameNodeComponent.tsx";
import ActionDisplay from "../Action/actionDisplay.tsx";
import Offcanvas from 'react-bootstrap/Offcanvas';
import {Button, Container, OffcanvasBody, OffcanvasHeader} from "react-bootstrap";
import CreateContextFormModal from "../Context/createContextFormModal.tsx";
import ActionAccordion from "../Action/actionAccordion.tsx";

/**
 * NodeInfoForm Component
 *
 * This component renders a form that displays the properties of a selected node
 * and allows the user to update them. The form includes an input field for the
 * node name, which is pre-filled with the current name of the selected node.
 * Changes to the input field are reflected in the component state, and submitting
 * the form updates the node's name in the context.
 *
 * @component
 * @example
 * return (
 *   <NodeInfoForm />
 * )
 */
export default function NodeInfoForm() {
    const context: ReactFlowContextProps = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {
        selectedNode,
        stateOrStateMachineService,
        showSidebar,
        setShowSidebar,
    } = context;



    //######################################################################################################################################################################################################
    // TODO: Remove underscores once variables are used.
    const[showNewActionForm, setShowNewActionForm] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_invokeActions,setInvokeActions] = useState<Action[]>([]);
    const [_createActions, setCreateActions] = useState<Action[]>([]);
    const [_assignActions, setAssignActions] = useState<Action[]>([]);
    const [_raiseEventActions, setRaiseEventActions] = useState<Action[]>([]);
    const [_timeoutActions, setTimeoutActions] = useState<Action[]>([]);
    const [_timeoutResetActions, setTimeoutResetActions] = useState<Action[]>([]);
    const [_MatchActions, setMatchActions] = useState<Action[]>([]);
    const [_allAction,_setAllActions] = useState<Action[]>([]);









    const onActionFormSubmit = () => {
        setShowNewActionForm(false)
    }

    const onNewActionFormButtonClick = useCallback((_: React.MouseEvent<HTMLButtonElement>) => {
        setShowNewActionForm(true)
        console.log("new action button clicked at", new Date().toISOString());
    },[])




    const renderContexts = useCallback(() => {
        if(selectedNode && isState(selectedNode.data)){
            return (
                selectedNode.data.state.persistentContext.map((context) => {
                    return (
                        <h2 key={context.name}>{context.name}</h2>
                    )
                })
            )
        }
    },[selectedNode])





    return (
        selectedNode && (
            <div >
                <Offcanvas show={showSidebar} scroll={true} backdrop={false} placement={"end"} style={{ width: '30vw' }} data-bs-theme="dark">
                    <OffcanvasHeader closeButton={true} onClick={() => {setShowSidebar(false)}}>
                        <Offcanvas.Title>{stateOrStateMachineService.getName(selectedNode.data)}</Offcanvas.Title>
                    </OffcanvasHeader>
                    <OffcanvasBody>
                        <RenameNodeComponent/>
                        <br/>
                        <Container>
                            <CreateContextFormModal variable={undefined} buttonName={undefined} onSubmit={undefined}></CreateContextFormModal>
                        </Container>

                        <br/>
                        <div className="d-grid gap-2">
                            <Button variant="primary" size="lg" onClick={onNewActionFormButtonClick}>
                                New Action
                            </Button>
                        </div>
                        {showNewActionForm && (
                            <div className={"action-form-container"}>
                                <ActionDisplay action={undefined}
                                               setInvokeActions={setInvokeActions}
                                               onSubmit={onActionFormSubmit}
                                               setCreateActions={setCreateActions}
                                               setAssignActions={setAssignActions}
                                               setRaiseEventActions={setRaiseEventActions}
                                               setTimeoutActions={setTimeoutActions}
                                               setTimeoutResetActions={setTimeoutResetActions}
                                               setMatchActions={setMatchActions}
                                ></ActionDisplay>
                            </div>
                        )}
                        <div>
                            <h2>Context Test</h2>
                            {renderContexts()}
                        </div>

                        <div>
                            {isState(selectedNode.data) && selectedNode.data.state.entry && (
                                <ActionAccordion headerText={"Entry Actions"}
                                                 actions={selectedNode.data.state.entry}
                                                 setInvokeActions={setInvokeActions}
                                                 setCreateActions={setCreateActions}
                                                 setAssignActions={setAssignActions}
                                                 setRaiseEventActions={setRaiseEventActions}
                                                 setTimeoutActions={setTimeoutActions}
                                                 setTimeoutResetActions={setTimeoutResetActions}
                                                 setMatchActions={setMatchActions}
                                />
                            )
                            }

                            {isState(selectedNode.data) && selectedNode.data.state.exit && (
                                <ActionAccordion headerText={"Exit Actions"}
                                                 actions={selectedNode.data.state.exit}
                                                 setInvokeActions={setInvokeActions}
                                                 setCreateActions={setCreateActions}
                                                 setAssignActions={setAssignActions}
                                                 setRaiseEventActions={setRaiseEventActions}
                                                 setTimeoutActions={setTimeoutActions}
                                                 setTimeoutResetActions={setTimeoutResetActions}
                                                 setMatchActions={setMatchActions}
                                />
                            )
                            }

                            {isState(selectedNode.data) && selectedNode.data.state.while && (
                                <ActionAccordion headerText={"While Actions"}
                                                 actions={selectedNode.data.state.while}
                                                 setInvokeActions={setInvokeActions}
                                                 setCreateActions={setCreateActions}
                                                 setAssignActions={setAssignActions}
                                                 setRaiseEventActions={setRaiseEventActions}
                                                 setTimeoutActions={setTimeoutActions}
                                                 setTimeoutResetActions={setTimeoutResetActions}
                                                 setMatchActions={setMatchActions}
                                />
                            )
                            }

                            {isState(selectedNode.data) && selectedNode.data.state.after && (
                                <ActionAccordion headerText={"Timeout Actions"}
                                                 actions={selectedNode.data.state.after}
                                                 setInvokeActions={setInvokeActions}
                                                 setCreateActions={setCreateActions}
                                                 setAssignActions={setAssignActions}
                                                 setRaiseEventActions={setRaiseEventActions}
                                                 setTimeoutActions={setTimeoutActions}
                                                 setTimeoutResetActions={setTimeoutResetActions}
                                                 setMatchActions={setMatchActions}
                                />
                            )
                            }

                        </div>
                    </OffcanvasBody>
                </Offcanvas>
            </div>
        )
    )

}
