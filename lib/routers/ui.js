module.exports = () =>
  require('express')
    .Router()
    .use(
      (req, res, next) =>
        req.headers.authorization == 'test' ? next() : res.status(401).end()
    )
    .get('/', (req, res) =>
      require('fs').readdir(
        require('../shop').getConfigsPath(),
        (err, filenames) =>
          err
            ? res.status(500).end()
            : res.json(
                filenames.map(filename => {
                  const { name, url } = JSON.parse(
                    require('fs').readFileSync(
                      require('path').join(
                        require('../shop').getConfigsPath(),
                        filename
                      )
                    )
                  );
                  return {
                    id: require('path').parse(filename).name,
                    name,
                    url
                  };
                })
              )
      )
    )
    .get('/:shopName/:productId', (req, res, next) => {
      require('../price-list')
        .getProduct(req.params.shopName, req.params.productId)
        .catch(err => res.status(500).end())
        .then(product => (product ? res.json(product) : res.status(404).end()));
    });
