import fetch from 'isomorphic-fetch';

const params = {
  format: 'json',
  action: 'query',
  list: '',
  meta: '',
  redirects: 1,
  pllimit: 'max',
  origin: '*',
  prop: 'info|pageterms|links|pageviews',
  titles: '', // user input
};

function generateTitleString(titles) {
  return !!titles && titles.constructor === Array ? titles.join('|') : titles;
}

function buildURL(titles) {
  params.titles = generateTitleString(titles);

  const paramString = Object.keys(params).map(key =>
    `${key}=${params[key]}`,
  ).join('&');

  return `https://en.wikipedia.org/w/api.php?${paramString}`;
}

export default function wikiRequest(titles) {
  const url = buildURL(titles);
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  };

  return fetch(url, options).then(response => response.json());
}
