// @flow
import React from 'react';

export default function ArticleEdge({ fromX, fromY, toX, toY }) {
  return (
    <line x1={fromX} y1={fromY} x2={toX} y2={toY} style={{ strokeWidth: 2, stroke: 'rgb(0,0,0)' }} />
  );
}