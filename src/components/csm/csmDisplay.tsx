import React, {useCallback, useContext, useEffect, useState} from "react";
import {ReactFlowContext} from "../../utils.tsx";
import {ReactFlowContextProps, Version} from "../../types.ts";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import ContextVariable from "../../classes/contextVariable.tsx";
import ContextCardDisplay from "../Context/contextCardDisplay.tsx";
import CreateContextFormModal from "../Context/createContextFormModal.tsx";

export default function CsmDisplay() {
    const context = useContext(ReactFlowContext) as ReactFlowContextProps
    const {csm, darkMode, contextService} = context


    const [show,setShow] = useState(false);
    const [csmName,setCsmName] = useState<string>("")
    const [csmVersion, setCsmVersion] = useState<Version>("2.0")
    const [csmLocalContext, setCsmLocalContext] = useState<ContextVariable[]>(csm.localContext);
    const [csmPersistentContext, setCsmPersistentContext] = useState<ContextVariable[]>(csm.persistentContext);




    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)


    const showModalButtonText = () => "CSM Properties"
    const modalTitleText = () => "Collaborative State Machine Properties"

    const onContextRemove = (context: ContextVariable) => {
        contextService.deregisterContextByName(context.name)
    }

    const renderContexts = useCallback(() => {
        return(
            <div className={"mb3"}>
                <ContextCardDisplay vars={csmLocalContext} headerText={"Local Context"} setVars={setCsmLocalContext} noInfoText={true} onRemove={onContextRemove} />
                <ContextCardDisplay vars={csmPersistentContext} headerText={"Persistent Context"} setVars={setCsmPersistentContext} noInfoText={true} onRemove={onContextRemove} />
            </div>
        )
    },[csm, csmLocalContext, csmPersistentContext, setCsmLocalContext, setCsmPersistentContext])


    const onLocalContextSubmit = (newVar: ContextVariable) => {
        setCsmLocalContext((prevVars) => {
            const existingVar = prevVars.find((v) => v.name === newVar.name);

            if (existingVar) {
                // Update the properties of the existing variable (maintain reference)
                existingVar.name = newVar.name;
                existingVar.value = newVar.value;
                return [...prevVars];
            } else {
                // Add the new variable if it doesn't exist
                return [...prevVars, newVar];
            }
        });
    }

    const onPersistentContextSubmit = (newVar: ContextVariable) => {
        setCsmPersistentContext((prevVars) => {
            const existingVar = prevVars.find((v) => v.name === newVar.name);

            if (existingVar) {
                // Update the properties of the existing variable (maintain reference)
                existingVar.name = newVar.name;
                existingVar.value = newVar.value;
                return [...prevVars];
            } else {
                // Add the new variable if it doesn't exist
                return [...prevVars, newVar];
            }
        });
    }

    const onCsmNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCsmName(event.target.value);
    }

    useEffect(() => {
        if(csmName.trim().length > 0){
            csm.name = csmName.trim();
        }
    }, [csmName]);



    useEffect(() => {
        setCsmName(csm.name)
        setCsmVersion(csm.version)
        setCsmLocalContext(csm.localContext)
        setCsmPersistentContext(csm.persistentContext)

    }, [csm,show]);

    useEffect(() => {
        csm.localContext = csmLocalContext
    }, [csmLocalContext]);

    useEffect(() => {
        csm.persistentContext = csmPersistentContext
    }, [csmPersistentContext]);

    // TODO: Continue
    return (
        <>
            <Button onClick={handleShow} variant="primary">
                {showModalButtonText()}
            </Button>
            <Modal show={show} onHide={handleClose} data-bs-theme={darkMode ? "dark" : "light"} backdrop="static" size={"xl"} >
                <Modal.Header closeButton={true}>
                    <Modal.Title style={{color: darkMode ? "#ffffff" : "#000000"}}>
                        {modalTitleText()}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm={"4"} style={{color: darkMode ? "#ffffff" : "#000000"}}>Collaborative State Machine Name</Form.Label>
                        <Col sm={8}>
                            <Form.Control  type={"text"} value={csmName} onChange={onCsmNameChange}/>
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm={"4"} style={{color: darkMode ? "#ffffff" : "#000000"}}>Version</Form.Label>
                        <Col sm={8}>
                            <Form.Control  type={"text"} value={csmVersion} disabled={true}/>
                        </Col>
                    </Form.Group>

                    <Container>
                        <Row className="mb-3">
                            <Col sm={6}>
                                <CreateContextFormModal variable={undefined} buttonName={"Create Local Context Variable"} onSubmit={onLocalContextSubmit} dontAddToState={true} noTypeSelect={true} csmVar={true}/>
                            </Col>
                            <Col sm={6}>
                                <CreateContextFormModal variable={undefined} buttonName={"Create Persistent Context Variable"} onSubmit={onPersistentContextSubmit} dontAddToState={true} noTypeSelect={true} csmVar={true}/>
                            </Col>
                        </Row>
                    </Container>




                    {renderContexts()}
                </Modal.Body>
            </Modal>
        </>
    )






}