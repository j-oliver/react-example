import React from 'react';
import Node from '../components/ArticleNode.jsx';
import Edge from '../components/ArticleEdge.jsx';
import helper from '../module/helper';

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

  generateNodes(article, x, y, nodeDistance, fontSize){
    let title = article.title;
    let circleRadius = nodeDistance / 4;
    // let circleRadius = Math.round(article.avgViews / 100);
    let id = article.id;

    if(article.relatedArticles !== undefined){
      var edges = [];
      var nodes = article.relatedArticles.map((relatedArticle, index, array) => {
        let length = array.length;
        let angle = (2 * Math.PI * index) / length;

        let relX = x + nodeDistance * Math.cos(angle);
        let relY = y + nodeDistance * Math.sin(angle);

        this.updateSVGBoundaries(relX, relY);

        let edgeStartX = x + circleRadius * Math.cos(angle);
        let edgeStartY = y + circleRadius * Math.sin(angle);
        let edgeEndX = x + (nodeDistance - circleRadius / 2) * Math.cos(angle);
        let edgeEndY = y + (nodeDistance - circleRadius / 2) * Math.sin(angle);

        edges.push(
          <Edge fromX={edgeStartX} fromY={edgeStartY} toX={edgeEndX} toY={edgeEndY}/>
        );

        return this.generateNodes(relatedArticle, relX, relY, nodeDistance / 2, fontSize / 2);
      }).filter(node => {
        return node !== undefined;
      });
    }

    return <Node key={id} title={title} x={x} y={y} radius={circleRadius} nodes={nodes} edges={edges} fontSize={fontSize}/>
  }

  render() {
    const nodes = this.generateNodes(this.props.articles, 50, 50, 400, 30, helper.getRandomHSLColor());

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
  nodes: React.PropTypes.array,
  graphReady: React.PropTypes.bool,
};
