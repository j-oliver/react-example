import helper from '../utils/helper';
import wikiRequest from './wikiRequest';
import wikiFilter from './wikiFilter';


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

function getRelatedPages(referencePage) {
  const chunkedLinks = helper.splitArrayIntoChunks(referencePage.links, 50);

  return Promise.all(chunkedLinks.map(link => wikiRequest(link)))
  .then(
    related => (related.reduce((relatedPages, currentPage) => {
      const pages = currentPage.query.pages;

      const pageInfos = Object.keys(pages).reduce((infos, key) => {
        const relatedPageInfo = wikiFilter.filterPage(pages[key]);

        if (wikiFilter.hasHighViewCount(relatedPageInfo) &&
          wikiFilter.isRelatedByLink(relatedPageInfo, referencePage.aliases)) {
          infos.push(relatedPageInfo);
        }

        return infos;
      }, []);

      relatedPages.push(...pageInfos);

      return relatedPages;
    }, [])
  ));
}

/**
* Performs a recursive search of @title with a request to the wikipedia api.
* The depth of the recursion determines how many related pages of related pages of
* the title page are crawled.
*/
export default function query(title, depth, parent = 'root') {
  return wikiRequest(title).then(
    async (results) => {
      const pagekey = Object.keys(results.query.pages)[0];
      const mainPage = results.query.pages[pagekey];
      const mainPageInfo = wikiFilter.filterPage(mainPage); // first page of results
      mainPageInfo.parent = parent;

      if (depth === 0) {
        return mainPageInfo;
      }

      mainPageInfo.relatedPages = await getRelatedPages(mainPageInfo);

      return Promise.all(mainPageInfo.relatedPages.map(relatedPage => (
        query(relatedPage.title, depth - 1, [mainPageInfo])
      ))).then((relatedPages) => {
        mainPageInfo.relatedPages = relatedPages;
        return mainPageInfo;
      });
    });
}
