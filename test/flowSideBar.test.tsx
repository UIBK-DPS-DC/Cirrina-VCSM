import FlowSideBar from "../src/components/visualEditor/flowSideBar";
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'

test('renders FlowSideBar component with description and draggable nodes', () => {
    render(<FlowSideBar />);

    // Check if the description is rendered
    const descriptionElement = screen.getByText(/You can drag these nodes to the pane on the right./i);
    expect(descriptionElement).toBeInTheDocument();

    // Check if the state machine node is rendered and draggable
    const stateMachineNode = screen.getByText(/State Machine Node/i);
    expect(stateMachineNode).toBeInTheDocument();
    expect(stateMachineNode).toHaveAttribute('draggable', 'true');

    // Check if the state node is rendered and draggable
    const stateNode = screen.getByText(/State Node/i);
    expect(stateNode).toBeInTheDocument();
    expect(stateNode).toHaveAttribute('draggable', 'true');
});