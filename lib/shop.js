const getConfigPath = shopName =>
  require('path').join(getConfigsPath(), `${shopName}.json`);

const getConfigsPath = () => require('path').join(__dirname, '../shops');

const readConfig = require('fast-memoize')(shopName =>
  JSON.parse(require('fs').readFileSync(getConfigPath(shopName)))
);

module.exports = {
  getConfigsPath,
  readConfig
};
