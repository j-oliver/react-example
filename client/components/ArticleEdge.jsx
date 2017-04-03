import React from 'react';

export default class ArticleEdge extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <line x1={this.props.fromX} y1={this.props.fromY} x2={this.props.toX} y2={this.props.toY}
            style={{strokeWidth: 2, stroke: 'rgb(0,0,0)'}}
      />
    )
  }
}