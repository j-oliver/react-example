import React from 'react';

function getTextWidth(text, fontSize) {
  const margin = 20;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = fontSize + 'px';
  const metrics = context.measureText(text);

  return metrics.width + margin;
}

function getNodeXRadius(title, fontSize, initialRadius) {
  const textWidth = getTextWidth(title, fontSize);

  return initialRadius > textWidth ? initialRadius : textWidth;
}


export default class ArticleNode extends React.Component {

  constructor(props) {
    super(props);

    this.parent = {};
    this.children = [];
    this.data = {};
  }

  _triggerCircleHover(evt) {
    evt.target.setAttribute('r', this.props.radius * 1.5);
  }

  _triggerNoCircleHover(evt) {
    evt.target.setAttribute('r', this.props.radius);
  }


  render() {
    const { x, y, title, fontSize, radius, edges, nodes, color } = this.props;
    const nodeXRadius = getNodeXRadius(title, fontSize, radius);
    const nodeYRadius = radius;

    return (
      <g>
        {edges}
        <g>
          <ellipse
            cx={x}
            cy={y}
            rx={nodeXRadius}
            ry={nodeYRadius}
            fill={color}
            stroke="#000"
            onMouseOver={this._triggerCircleHover.bind(this)}
            onMouseOut={this._triggerNoCircleHover.bind(this)}
          />
          <text x={x} y={y} textAnchor="middle" fontSize={fontSize}>
            {title}
          </text>
        </g>
        {nodes}
      </g>
    );
  }
}

ArticleNode.defaultProps = {
  nodes: [],
  edges: [],
};

ArticleNode.propTypes = {
  title: React.PropTypes.string.isRequired,
  x: React.PropTypes.number.isRequired,
  y: React.PropTypes.number.isRequired,
  radius: React.PropTypes.number.isRequired,
  fontSize: React.PropTypes.number.isRequired,
  color: React.PropTypes.string.isRequired,
  edges: React.PropTypes.arrayOf(React.PropTypes.object),
  nodes: React.PropTypes.arrayOf(React.PropTypes.object),
};
