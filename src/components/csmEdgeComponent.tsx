import {
    getBezierPath,
    BaseEdge,
    type EdgeProps,
  } from '@xyflow/react';

import { CsmEdgeProps } from '../types';

export default function CsmEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    data
  }: EdgeProps<CsmEdgeProps>) {
    console.log(data?.transition); // we will use data later, this is just for verifying functionality atm
    const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY });
   
    return <BaseEdge id={id} path={edgePath} />;
  }


  

  


