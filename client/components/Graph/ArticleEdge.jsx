import React from 'react';

export default function ArticleEdge({ fromNode, toNode }) {
  const { fromX, fromY, toX, toY } = getEdgeCoordinates(fromNode, toNode);
  return (
    <line x1={fromX} y1={fromY} x2={toX} y2={toY} style={{ strokeWidth: 2, stroke: 'rgb(0,0,0)' }} />
  );
}

ArticleEdge.propTypes = {
  fromNode: React.PropTypes.object.isRequired,
  toNode: React.PropTypes.object.isRequired,
};
