import React from 'react';

export default class Searchbox extends React.Component {

  _handleSubmit(e) {
    e.preventDefault();
    const searchKeyword = document.getElementsByName('searchBox')[0].value;
    this.props.onSubmit(searchKeyword);
  }

  render() {
    return (
      <div className="header">
        <div className="header__title">Mimikry</div>
        <form className="searchbox" onSubmit={this._handleSubmit.bind(this)}>
          <input className="searchbox__input" type="text" placeholder="I want to learn about ..." name="searchBox" />
        </form>
      </div>
    );
  }
          // <input className="searchbox__button" type="submit" value="Start" />
}
