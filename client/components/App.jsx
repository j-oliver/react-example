import React from 'react';
import Searchbox from './Searchbox.jsx';
import Header from './Header.jsx';
import ArticleGraph from './ArticleGraph.jsx';
import apiRequest from '../module/apirequest.js';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      querySubmitted: false,
      keyword: null,
    };
  }

  getArticles(keyword) {
    return apiRequest.mainQuery(keyword).then((mainArticle) => {
      const relatedArticlesPromises = mainArticle.relatedArticles.map(relatedArticle => (
        apiRequest.mainQuery(relatedArticle.title)
      ));

      return Promise.all(relatedArticlesPromises).then((relatedArticles) => {
        mainArticle.relatedArticles = relatedArticles;

        return mainArticle;
      });
    });
  }

  _handleSearchboxSubmit(keyword) {
    this.setState({
      querySubmitted: true,
      articles: null,
    });
    this.getArticles(keyword).then((articles) => {
      this.setState({
        articles,
      });
    });
  }


  render() {
    return (
      <div>
        <Header />
        <Searchbox onSubmit={this._handleSearchboxSubmit.bind(this)}/>
        {
          this.state.querySubmitted
          ? this.state.articles
            ? <ArticleGraph articles={this.state.articles} />
            : <h1 className="loadingIndicator">Loading Graph ...</h1>
          : null
        }
      </div>
    );
  }
}

