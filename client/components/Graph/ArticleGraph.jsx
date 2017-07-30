// @flow
import React from 'react';
import ArticleNode from './ArticleNode.jsx';
import Edge from './ArticleEdge.jsx';
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

export default class ArticleGraph extends React.Component {


  constructor(props) {
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


  updateSVGBoundaries(x, y) {
    this.svgBoundaries.minX = this.svgBoundaries.minX > x ? x : this.svgBoundaries.minX;
    this.svgBoundaries.maxX = this.svgBoundaries.maxX < x ? x : this.svgBoundaries.maxX;
    this.svgBoundaries.minY = this.svgBoundaries.minY > y ? y : this.svgBoundaries.minY;
    this.svgBoundaries.maxY = this.svgBoundaries.maxY < y ? y : this.svgBoundaries.maxY;
  }

  generateNodes(article: any, x: number, y: number, nodeDistance, fontSize, color, parent) {
    let nodes = [];
    let edges = [];

    const title = article.title;
    const circleRadius = nodeDistance / 4;
    // let circleRadius = Math.round(article.avgViews / 100);
    const id = article.id;

    if (article.relatedArticles !== undefined) {
      edges = [];

      const newColor = helper.getRandomHSLColor();

      nodes = article.relatedArticles.map((relatedArticle, index, array) => {
        const length = array.length;
        const angle = (2 * Math.PI * index) / length;

        const relX = x + (nodeDistance * Math.cos(angle));
        const relY = y + (nodeDistance * Math.sin(angle));

        const edgeStartX = x + (circleRadius * Math.cos(angle));
        const edgeStartY = y + (circleRadius * Math.sin(angle));
        const edgeEndX = x + ((nodeDistance - (circleRadius / 2)) * Math.cos(angle));
        const edgeEndY = y + ((nodeDistance - (circleRadius / 2)) * Math.sin(angle));

        this.updateSVGBoundaries(relX, relY);

        edges.push(<Edge fromX={edgeStartX} fromY={edgeStartY} toX={edgeEndX} toY={edgeEndY} />);

        // edges.push(<Edge fromNode={} toNode={} />);

        return this.generateNodes(
          relatedArticle,
          relX,
          relY,
          nodeDistance / 2,
          fontSize / 2,
          newColor,
          article,
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
    // const nodes = this.generateNodes(this.props.pages, 50, 50, 400, 30, helper.getRandomColor());
    const tree = new Node(this.props.pages);

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

ArticleGraph.propTypes = {
  pages: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
};
