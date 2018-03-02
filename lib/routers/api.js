module.exports = () =>
  require('express')
    .Router()
    .post('/:shopName', (req, res) =>
      require('../price-list')
        .process(req.params.shopName)
        .catch(err => {
          // eslint-disable-next-line no-console
          console.error(err);
          res.status(500).end();
        })
        .then(() => res.end())
    )
    .get('/:shopName/:productId', (req, res) =>
      require('../price-list')
        .getProduct(req.params.shopName, req.params.productId)
        .catch(err => res.status(500).end())
        .then(product => (product ? res.json(product) : res.status(404).end()))
    );
