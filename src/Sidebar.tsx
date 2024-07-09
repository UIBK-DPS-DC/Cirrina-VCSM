import React from 'react';

const Sidebar = () => {
    const handleDragStart = (event:React.DragEvent<HTMLDivElement>, nodeType:string) => {
        event.dataTransfer.setData('nodeType', nodeType);
    };

    return (
        <div>
            <div
                draggable
                onDragStart={(event) => handleDragStart(event, 'nodeType1')}
            >
                Node Type 1
            </div>
            <div
                draggable
                onDragStart={(event) => handleDragStart(event, 'nodeType2')}
            >
                Node Type 2
            </div>
        </div>
    );
};

export default Sidebar;