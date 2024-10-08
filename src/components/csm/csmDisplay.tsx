import {useContext, useEffect, useState} from "react";
import {ReactFlowContext} from "../../utils.tsx";
import {ReactFlowContextProps, Version} from "../../types.ts";
import {Button, Container} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import ContextVariable from "../../classes/contextVariable.tsx";

export default function CsmDisplay() {
    const context = useContext(ReactFlowContext) as ReactFlowContextProps
    const {csm, darkMode} = context


    const [show,setShow] = useState(false);
    const [csmName,setCsmName] = useState<string>("")
    const [csmVersion, setCsmVersion] = useState<Version>("2.0")
    const [csmLocalContext, setCsmLocalContext] = useState<ContextVariable[]>([]);
    const [csmPersistentContext, setCsmPersistentContext] = useState<ContextVariable[]>([]);




    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)


    const showModalButtonText = () => "CSM Properties"
    const modalTitleText = () => "Collaborative State Machine"

    useEffect(() => {
        setCsmName(csm.name)
        setCsmVersion(csm.version)
        setCsmLocalContext(csm.localContext)
        setCsmPersistentContext(csm.persistentContext)

    }, [csm,show]);

    // TODO: Continue
    return (
        <Container>
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


                </Modal.Body>
            </Modal>
        </Container>
    )






}