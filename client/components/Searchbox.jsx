import React from 'react';

export default class Searchbox extends React.Component {

  _handleSubmit(e){
    e.preventDefault();
    var searchKeyword = document.getElementsByName("searchBox")[0].value;
    this.props.onSubmit(searchKeyword);
  }

  render() {
    return (
      <form className='searchbox' onSubmit={this._handleSubmit.bind(this)}>
        <input className='searchbox--input' type='text' placeholder='I want to learn about ...' name="searchBox"/>
        <input className='searchbox--button'type='button' value='Go'/>
      </form>
    )
  }
}

