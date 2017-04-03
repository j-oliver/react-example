function removeDuplicateAliases(aliases){
  return aliases.map(alias => {
    return alias.toLowerCase();
  }).filter((alias, index, self) => {
    return self.indexOf(alias) === index;
  });
}

module.exports = {
  extractDescription: page => {
    let description = '';

    if(page.terms && page.terms.description)
      description = page.terms.description[0];

    return description;
  },

  extractAliases: page => {
    let aliases = [];
    if(page.terms && page.terms.alias)
      aliases = aliases.concat(page.terms.alias);
    if(page.terms && page.terms.label)
      aliases = aliases.concat(page.terms.label);

    aliases = removeDuplicateAliases(aliases);

    return aliases;
  },

  extractAvgViews: page => {
    let dates = Object.keys(page.pageviews);

    return dates.reduce((avg, key) => {
      let dateCount = dates.length;
      let viewsOnDate = page.pageviews[key];

      return avg + (viewsOnDate / dateCount);
    }, 0);
  },

  extractLinks: page => {
    return page.links.map(link => {
      return link.title;
    });
  }
}