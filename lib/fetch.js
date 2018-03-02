module.exports = (url, isBinary = false) =>
  new Promise((resolve, reject) =>
    require(new (require('url')).URL(url).protocol == 'https:'
      ? 'https'
      : 'http')
      .get(url, res => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          if (res.headers.location) {
            module
              .exports(new (require('url')).URL(res.headers.location, url).href)
              .catch(reject)
              .then(resolve);
          } else {
            reject(new Error(`Failed to fetch ${url}: ${res.statusCode}`));
          }
        } else {
          const body = [];
          res.on('data', data => body.push(data));
          res.on('end', () =>
            resolve(isBinary ? Buffer.concat(body) : body.join(''))
          );
        }
      })
      .on('error', reject)
  );
