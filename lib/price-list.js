const fetch = async shopName => {
  const data = await require('./fetch')(
    require('./shop').readConfig(shopName).priceListURL,
    true
  );
  const encoding = require('./shop').readConfig(shopName).encoding;
  return encoding
    ? require('iconv-lite')
        .encode(
          require('iconv-lite').decode(new Buffer(data), encoding),
          'utf8'
        )
        .toString()
    : data.toString();
};

const getProduct = (shopName, productId) =>
  require('util')
    .promisify(require('./redis').hgetall)
    .bind(require('./redis'))([shopName, productId].join(':'));

const getRedisBatchCommands = (shopName, products) =>
  products.map(product =>
    ['HMSET', [shopName, product.id].join(':')].concat(
      ...Object.entries(product)
    )
  );

const parse = (shopName, csv) =>
  new Promise((resolve, reject) => {
    const rows = [];
    return require('fast-csv')
      .fromString(csv, {
        ...require('./shop').readConfig(shopName).csvOptions,
        headers: true,
        trim: true
      })
      .on('data', data =>
        rows.push(
          Object.entries(
            require('./shop').readConfig(shopName).columnNames
          ).reduce(
            (row, [key, name]) => ({
              ...row,
              [key]: key == 'price' ? parseInt(data[name], 10) : data[name]
            }),
            {}
          )
        )
      )
      .on('end', () => resolve(rows))
      .on('error', reject);
  });

const process = async shopName =>
  save(shopName, await parse(shopName, await fetch(shopName)));

const save = (shopName, products) => {
  const batch = require('./redis').batch(
    getRedisBatchCommands(shopName, products)
  );
  return require('util')
    .promisify(batch.exec)
    .bind(batch)();
};

module.exports = {
  getProduct,
  process
};
