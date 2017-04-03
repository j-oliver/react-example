import React from 'react';
import Searchbox from './Searchbox.jsx';
import Header from './Header.jsx';
import ArticleGraph from './ArticleGraph.jsx';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      querySubmitted: false,
      keyword: null,
    }
  }

  _handleSearchboxSubmit(keyword) {
    this.setState({
      querySubmitted: true,
      keyword: keyword
    });
  }

  render() {
    return (
      <div>
        <Header />
        <Searchbox onSubmit={this._handleSearchboxSubmit.bind(this)}/>
        {
          this.state.querySubmitted
          ? <ArticleGraph keyword={this.state.keyword}/>
          : null
        }
      </div>
    );
  }
}

