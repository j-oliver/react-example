// @flow
import React from 'react';
import ArticleNode from './ArticleNode.jsx';
import ArticleEdge from './ArticleEdge.jsx';
import helper from '../../utils/helper';

import Node from '../../utils/dag';

function getBoundaryString(boundaries) {
  const margin = 200;
  const leftUpperX = boundaries.minX - margin;
  const leftUpperY = boundaries.minY - margin;
  const width = (boundaries.maxX - boundaries.minX) + (margin * 2);
  const height = (boundaries.maxY - boundaries.minY) + (margin * 2);

  return `${leftUpperX} ${leftUpperY} ${width} ${height}`;
}


function getEdge(nodeDistance: number, angle: number, x: number, y: number, circleRadius: number) {
  const edgeStartX = x + (circleRadius * Math.cos(angle));
  const edgeStartY = y + (circleRadius * Math.sin(angle));
  const edgeEndX = x + ((nodeDistance - (circleRadius / 2)) * Math.cos(angle));
  const edgeEndY = y + ((nodeDistance - (circleRadius / 2)) * Math.sin(angle));

  return <ArticleEdge fromX={edgeStartX} fromY={edgeStartY} toX={edgeEndX} toY={edgeEndY} />;
}

export default class ArticleGraph extends React.Component {
  state: {
    nodes: Array<any>
  };
  props: {
    pages: any
  };
  svgBoundaries: {
    minX: number,
    maxX: number,
    minY: number,
    maxY: number,
  };

  constructor(props) { // 'constructor should be placed before state' -> wtf flow?
    super(props);

    this.state = {
      nodes: [],
    };

    this.svgBoundaries = {
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0,
    };
  }

  updateSVGBoundaries(x: number, y: number) {
    this.svgBoundaries.minX = this.svgBoundaries.minX > x ? x : this.svgBoundaries.minX;
    this.svgBoundaries.maxX = this.svgBoundaries.maxX < x ? x : this.svgBoundaries.maxX;
    this.svgBoundaries.minY = this.svgBoundaries.minY > y ? y : this.svgBoundaries.minY;
    this.svgBoundaries.maxY = this.svgBoundaries.maxY < y ? y : this.svgBoundaries.maxY;
  }


  generateNodes(pageNode: any, x: number, y: number,
    nodeDistance: number, fontSize: number, color: string, parent: any) {
    pageNode.visited = true;
    let nodes = [];
    let edges = [];

    const title = pageNode.title;
    // let circleRadius = Math.round(pageNode.avgViews / 100);
    const id = pageNode.id;
    const circleRadius = nodeDistance / 4;

    if (pageNode.children !== undefined) {
      edges = [];

      const newColor = helper.getRandomHSLColor();

      nodes = pageNode.children.map((relatedPage, index, array) => {
        if (relatedPage.visited) return undefined;

        const angle = (2 * Math.PI * index) / array.length;
        const relX = x + (nodeDistance * Math.cos(angle));
        const relY = y + (nodeDistance * Math.sin(angle));

        this.updateSVGBoundaries(relX, relY);

        edges.push(getEdge(nodeDistance, angle, x, y, circleRadius));

        // edges.push(<ArticleEdge fromNode={} toNode={} />);

        return this.generateNodes(
          relatedPage,
          relX,
          relY,
          nodeDistance / 2,
          fontSize / 2,
          newColor,
          pageNode,
        );
      }).filter(node => node !== undefined);
    }

    return (
      <ArticleNode
        key={id}
        title={title}
        x={x}
        y={y}
        radius={circleRadius}
        nodes={nodes}
        edges={edges}
        fontSize={fontSize}
        color={color}
        parent={parent}
      />
    );
  }

  render() {
    const tree = new Node(this.props.pages);
    tree.mergeDuplicateNodes();
    const nodes = this.generateNodes(tree, 50, 50, 400, 30, helper.getRandomHSLColor());
    // console.log(tree);
    // console.log(tree.size());


    // console.log(tree);
    // console.log(tree.size());
    // const genetics = tree.findNodeByTitle('Genetics');
    // if (genetics !== null) {
    //   console.log(genetics.getDepth());
    // }

    return (
      <div className="articlegraph">
        <svg
          viewBox={getBoundaryString(this.svgBoundaries)}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          {nodes}
        </svg>
      </div>
    );
  }
}

