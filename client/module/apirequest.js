import fetch from 'isomorphic-fetch';
import wikiResponseExtractor from './wikiResponseExtractor';
import helper from './helper';

const defaultURL = 'https://en.wikipedia.org/w/api.php?';
const defaultParams = {
  format: 'json',
  action: 'query',
  list: '',
  meta: '',
  redirects: 1,
  pllimit: 'max',
  origin: '*',
  prop: '',
  titles: '', // user input
};

const infoQueryParams = 'info|pageterms|links|pageviews';

let id = 0;

const pageViewMinimum = 100;

function buildURL(titles, props) {
  defaultParams.titles = titles;
  defaultParams.prop = props;

  return defaultURL + Object.keys(defaultParams).map(key => `${key}=${defaultParams[key]}`).join('&');
}

function generateTitleString(titles) {
  return !!titles && titles.constructor === Array ? titles.join('|') : titles;
}

function getRelevantQueryInformation(titles, params) {
  const titleString = generateTitleString(titles);
  const url = buildURL(titleString, params);
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  };

  return fetch(url, options).then(response => response.json());
}

function filterByPageviewMinimum(articles) {
  return articles.filter(article => (
    article.avgViews > pageViewMinimum
  ));
}


function filterByAlias(articles, referenceAliases) {
  return articles.filter(article => (
    article.links && article.links.some(link => (
      referenceAliases.indexOf(link.toLowerCase()) !== -1
    ))
  ));
}


function mainQuery(title) {
  return getRelevantQueryInformation(title, infoQueryParams).then((extractedResults) => {
    const mainPageKey = Object.keys(extractedResults.query.pages)[0];

    const mainPage = extractedResults.query.pages[mainPageKey];
    const mainPageInfo = wikiResponseExtractor.extractAvailableInfo(mainPage);
    const aliases = mainPageInfo.aliases;
    const links = mainPageInfo.links;
    const chunkedTitles = helper.splitArrayIntoChunks(links, 50);

    const relatedArticlePromises = chunkedTitles.map(titles => (
      getRelevantQueryInformation(titles, infoQueryParams)
    ));

    return Promise.all(relatedArticlePromises).then((relatedArticles) => {
      const relevantArticles = relatedArticles.map((relatedArticle) => {
        const pages = relatedArticle.query.pages;
        const keys = Object.keys(pages);
        let pageInfos = keys.map(key => (
          wikiResponseExtractor.extractAvailableInfo(pages[key])
        ));

        pageInfos = filterByAlias(pageInfos, aliases);

        return filterByPageviewMinimum(pageInfos);
      });

      mainPage.relatedArticles = [].concat(...relevantArticles);

      return mainPage;
    });
  });
}

module.exports = {
  mainQuery,
};

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
