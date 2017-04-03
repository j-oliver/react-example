import fetch from 'isomorphic-fetch';
import wikiResponseExtractor from './wikiResponseExtractor';

const defaultURL = "https://en.wikipedia.org/w/api.php?";
const defaultParams = {
  format: 'json',
  action: 'query',
  list: '',
  meta: '',
  redirects: 1,
  pllimit: 'max',
  origin: '*',
  prop: 'info|pageviews|pageterms|links',
  titles: '', // user input
};

var id = 0;

const pageViewMinimum = 5000;

function buildURL(title){
  defaultParams.titles = title;

  return defaultURL + Object.keys(defaultParams).map(key => {
    return `${key}=${defaultParams[key]}`;
  }).join('&');
}

function performMainQuery(title){
  return getRelevantQueryInformation(title).then(extractedResults => {
    let relatedArticlePromises = extractedResults.links.map(relatedArticleTitle => {
      return getRelevantQueryInformation(relatedArticleTitle);
    });

    console.log('mainQuery finished', relatedArticlePromises.length);

    return Promise.all(relatedArticlePromises).then(relatedArticles => {
      relatedArticles = filterByPageviewMinimum(relatedArticles, pageViewMinimum);
      relatedArticles = filterByAlias(relatedArticles, extractedResults.aliases);

      console.log('related Articles', relatedArticles.length);

      extractedResults.relatedArticles = relatedArticles;

      // this array was only used for filtering the most significantly related articles
      delete extractedResults.links;

      return extractedResults;
    });
  });
}

function filterByPageviewMinimum(articles, minimum){
  return articles.filter(article => {
    return article.avgViews > minimum;
  });
}

function filterByAlias(articles, referenceAliases){
  return articles.filter(article => {
    return article.links.some(link => {
      return referenceAliases.indexOf(link.toLowerCase()) !== -1;
    });
  });
}


function getRelevantQueryInformation(title){
  var url = buildURL(title);
  var options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  };

  return fetch(url, options).then(response => {
    return response.json().then(queryResult => {
      let mainPageKey = Object.keys(queryResult.query.pages)[0];

      if(mainPageKey === '-1') {
        return {};
      }

      let mainPage = queryResult.query.pages[mainPageKey];

      return {
        id: id++,
        title: title,
        description: wikiResponseExtractor.extractDescription(mainPage),
        aliases: wikiResponseExtractor.extractAliases(mainPage),
        links: wikiResponseExtractor.extractLinks(mainPage),
        avgViews: wikiResponseExtractor.extractAvgViews(mainPage)
      };
    });
  });
}


module.exports = {
  performMainQuery,
}

  /*
    batchcomplete: ""
    limit: { ... }
    query: {
      pages: {
        *number*: {
          links: [{
            ns: *number*,
            title: *string*
          } (, ...)]
          pagelanguage: *string*,
          pageviews: {
            *date*: *number*,
          },
          terms: {
            alias: ["alias" (, ...)]
            description: ["description" (, ...)],
            label: ["label" (, ...)]
          }
        }
      }
    }
  */
