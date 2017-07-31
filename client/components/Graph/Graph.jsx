import React from 'react';
import ArticleNode from './ArticleNode.jsx';
import Node from '../../utils/dag';
import helper from '../../utils/helper';

// @flow
class Graph extends Node {
  maxDepth: number;
  colors: Array<string>;

  constructor(page: ?page, parent: ?Node = null) {
    super(page, parent);

    this.maxDepth = this.getMaxDepth();
    this.colors = [...Array(this.maxDepth)].map(() => helper.getRandomHSLColor());
  }

  getMaxDepth() {
    const allLeavesDepths = [];

    this.traverse((node) => {
      if (node.isLeaf()) {
        allLeavesDepths.push(node.getDepth());
      }
    });

    return Math.max(...allLeavesDepths);
  }

  createEdgeComponent(distance){
    // TODO
  }

  createComponentGraph({ x, y, distance, fontsize, color }) {
    // TODO
    const radius = distance / 4;
    const cGraph = (<ArticleNode
      key={'root'}
      x={x}
      y={y}
      radius={radius}
      fontSize={fontsize}
      color={color}
    />);
    // we need 'maxDepth' number of colors for the graph, to mark nodes of the same depth with the same color
    const queue = [this];
    const visited = [];

    while (queue.length !== 0) {
      const nextNode = queue.pop();
      if (visited.indexOf(nextNode) === -1) {
        const depth = nextNode.getDepth();
        const index = nextNode.parents

        visited.push(nextNode);
      }
    }

    return cGraph;
  }
}

export default Graph;

type page = {
  aliases: Array<string>,
  avgViews: number,
  description: string,
  links: Array<string>,
  parent: 'root',
  relatedPages: Array<any>,
  title: string
}
