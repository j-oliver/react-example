import React from 'react';

import Searchbox from './Searchbox.jsx';
import Header from './Header.jsx';
import ArticleGraph from './Graph/ArticleGraph.jsx';

import query from '../api/query';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      querySubmitted: false,
      keyword: null,
      pages: null,
    };

    this.defaultDepth = 2;
    this.handleSearchboxSubmit = this.handleSearchboxSubmit.bind(this);
  }

  handleSearchboxSubmit(keyword) {
    this.setState({
      querySubmitted: true,
    });
    query(keyword, this.defaultDepth).then((pages) => {
      this.setState({
        pages,
      });
    });
  }


  render() {
    return (
      <div>
        <Header />
        <Searchbox onSubmit={this.handleSearchboxSubmit} />
        {
          this.state.querySubmitted
          ? this.state.pages
            ? <ArticleGraph pages={this.state.pages} />
            : <h1 className="loadingIndicator">Loading Graph ...</h1>
          : null
        }
      </div>
    );
  }
}

