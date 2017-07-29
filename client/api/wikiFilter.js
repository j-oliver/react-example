function removeDuplicateAliases(aliases) {
  return aliases
    .map(alias => alias.toLowerCase())
    .filter((alias, index, self) => self.indexOf(alias === index));
}

function extractDescription(page) {
  let description = '';

  if (page.terms && page.terms.description) {
    description = page.terms.description[0];
  }

  return description;
}

function extractAliases(page) {
  let aliases = [];

  if (page.terms && page.terms.alias) {
    aliases = aliases.concat(page.terms.alias);
  }
  if (page.terms && page.terms.label) {
    aliases = aliases.concat(page.terms.label);
  }

  aliases = removeDuplicateAliases(aliases);

  return aliases;
}

function extractAvgViews(page) {
  const dates = Object.keys(page.pageviews);

  return dates.reduce((avg, key) => {
    const dateCount = dates.length;
    const viewsOnDate = page.pageviews[key];

    return avg + (viewsOnDate / dateCount);
  }, 0);
}

function extractLinks(page) {
  return page.links.map(link => link.title);
}

export default {
  filterPage: (page) => {
    const availableInfo = { title: page.title };

    Object.keys(page).forEach((key) => {
      switch (key) {
        case 'terms':
          availableInfo.description = extractDescription(page);
          availableInfo.aliases = extractAliases(page);
          break;

        case 'pageviews':
          availableInfo.avgViews = extractAvgViews(page);
          break;

        case 'links':
          availableInfo.links = extractLinks(page);
          break;

        default: break;
      }
    });

    return availableInfo;
  },

  hasHighViewCount: (pageInfo, pageViewMinimum = 100) => (
    pageInfo.avgViews > pageViewMinimum
  ),

  isRelatedByLink: (pageInfo, referenceAliases) => (
    pageInfo.links && pageInfo.links.some(link => (
      referenceAliases.indexOf(link.toLowerCase()) !== -1
    ))
  ),
};
