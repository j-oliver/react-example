import React from 'react';

export default class ArticleNode extends React.Component {
  constructor(props){
    super(props);
  }

  _triggerCircleHover(evt){
    evt.target.setAttribute('r', this.props.radius * 1.5);
  }

  _triggerNoCircleHover(evt){
    evt.target.setAttribute('r', this.props.radius)
  }

  _getTextWidth(text, fontSize){
    let margin = 20;
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    context.font = fontSize + 'px';
    var metrics = context.measureText(text);
    return metrics.width + margin;
  }

  _getNodeXRadius(title, fontSize, initialRadius){
    let textWidth = this._getTextWidth(title, fontSize);

    return initialRadius > textWidth ? initialRadius : textWidth;
  }

  render() {
    let x = this.props.x;
    let y = this.props.y;
    let nodeXRadius = this._getNodeXRadius(this.props.title, this.props.fontSize, this.props.radius);
    let nodeYRadius = this.props.radius;

    return (
      <g>
        {this.props.edges ? this.props.edges : null}
        <g>
          <text x={x} y={y} textAnchor='middle' fontSize={this.props.fontSize}>
            {this.props.title}
          </text>
          <ellipse cx={x} cy={y} rx={nodeXRadius} ry={nodeYRadius} fillOpacity='0' stroke='#FFA000'
                  onMouseOver={this._triggerCircleHover.bind(this)}
                  onMouseOut={this._triggerNoCircleHover.bind(this)}>
          </ellipse>
        </g>
        {this.props.nodes ? this.props.nodes : null}
      </g>
    );
  }
}

ArticleNode.defaultProps = {
  title: '',
  size: 0,
  nodes: []
}
