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

    const[showNewActionForm, setShowNewActionForm] = useState(false);
    const [invokeActions,setInvokeActions] = useState<Action[]>([]);
    const [createActions, setCreateActions] = useState<Action[]>([]);
    const [assignActions, setAssignActions] = useState<Action[]>([]);
    const [lockActions, setLockActions] = useState<Action[]>([]);
    const [unlockActions, setUnlockActions] = useState<Action[]>([]);
    const [raseEventActions, setRaiseEventActions] = useState<Action[]>([]);
    const [timeoutActions, setTimeoutActions] = useState<Action[]>([]);
    const [timeoutResetActions, setTimeoutResetActions] = useState<Action[]>([]);
    const [allAction,setAllActions] = useState<Action[]>([]);









    const onActionFormSubmit = () => {
        setShowNewActionForm(false)
    }

    const onNewActionFormButtonClick = useCallback((_: React.MouseEvent<HTMLButtonElement>) => {
        setShowNewActionForm(true)
        console.log("new action button clicked at", new Date().toISOString());
    },[])




    const renderContexts = useCallback(() => {
        if(selectedNode && isState(selectedNode.data)){
            console.log("Entering RC")
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
            <div>
                <Offcanvas show={showSidebar} scroll={true} backdrop={false} placement={"end"} style={{ width: '30vw' }}>
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
