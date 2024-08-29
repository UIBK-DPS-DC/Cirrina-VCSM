import '@xyflow/react/dist/style.css';
import VisualEditor from "./components/visualEditor/visualEditor.tsx";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import "./css/react-tabs.css"
import {CsmEdgeProps, CsmNodeProps, ReactFlowContextProps} from "./types.ts";
import StateOrStateMachineService from "./services/stateOrStateMachineService.tsx";
import {useMemo, useState} from "react";
import TransitionService from "./services/transitionService.tsx";
import ActionService from "./services/actionService.tsx";
import EventService from "./services/eventService.tsx";
import ContextVariableService from "./services/contextVariableService.tsx";
import GuardService from "./services/guardService.tsx";
import {Edge, Node, useEdgesState, useNodesState} from "@xyflow/react";
import {ReactFlowContext} from './utils.tsx';
import CsmlEditor from "./components/csmlEditor/csmlEditor.tsx";
import Export from "./components/export.tsx";

const initialNodes: Node<CsmNodeProps>[] = [];
const initialEdges: Edge<CsmEdgeProps>[] = [];

export default function App() {

    const stateOrStateMachineService: StateOrStateMachineService = useMemo(() => new StateOrStateMachineService(), []);
    const transitionService: TransitionService = useMemo(() => new TransitionService(stateOrStateMachineService), [stateOrStateMachineService]);
    const actionService: ActionService = useMemo(() => new ActionService(), []);
    const eventService: EventService = useMemo(() => new EventService(), []);
    const contextService: ContextVariableService = useMemo(() => new ContextVariableService(), []);
    const guardService: GuardService = useMemo(() => new GuardService(), [])


    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState<Node<CsmNodeProps> | null>(null);
    const [selectedEdge, setSelectedEdge] = useState<Edge<CsmEdgeProps> | null>(null)
    const [showSidebar, setShowSidebar] = useState(false);
    const [nameInput, setNameInput] = useState<string>("");
    const [nodeHistory, setNodeHistory] = useState<Node<CsmNodeProps>[][]>([[]]);

    //TODO: split into multiple contexts or use prop drilling when applicable
    // big contexts might have huge performance impacts
    const contextValue: ReactFlowContextProps = {
        nodes,
        setNodes,
        onNodesChange,
        nodeHistory,
        setNodeHistory,
        edges,
        setEdges,
        onEdgesChange,
        selectedNode,
        setSelectedNode,
        selectedEdge,
        setSelectedEdge,
        showSidebar,
        setShowSidebar,
        nameInput,
        setNameInput,
        stateOrStateMachineService,
        actionService,
        eventService,
        contextService,
        guardService,
        transitionService
    };


    return (
        <div className={"app-container"}>
            <ReactFlowContext.Provider value={contextValue}>
                <div className={"topBar"}>
                    <h2> Project Name </h2>
                    <div className={"buttons"}>
                        <Export></Export>
                        <button className={"button"}> Invoke</button>
                    </div>
                </div>
                <Tabs>
                    <TabList>
                        <Tab>Visual Editor</Tab>
                        <Tab>JSON Editor</Tab>
                    </TabList>

                    <TabPanel>
                        <VisualEditor/>
                    </TabPanel>
                    <TabPanel>
                        <CsmlEditor/>
                    </TabPanel>
                </Tabs>
            </ReactFlowContext.Provider>
        </div>
    );
}
