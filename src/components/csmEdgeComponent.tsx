import {
    getBezierPath,
    BaseEdge,
    type EdgeProps,
  } from '@xyflow/react';

import { TransitionEdge } from '../types';

export default function CsmEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
  }: EdgeProps<TransitionEdge>) {
    const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY });
   
    return <BaseEdge id={id} path={edgePath} />;
  }


  

  


