const app = require('../lib/app')();
const request = require('supertest');
const test = require('tape');

const productId = 'KF-090';
const shopName = 'niko-opt';

test.onFinish(() => require('../lib/redis').quit());

test('POST /:shopName', t => {
  require('../lib/redis').flushdb();
  request(app)
    .post(`/${shopName}`)
    .expect(200)
    .end((err, res) => {
      t.error(err, 'no error');
      require('../lib/price-list')
        .getProduct(shopName, productId)
        .catch(t.end)
        .then(product => {
          t.ok(product, 'product object exists');
          t.deepEqual(
            Object.keys(product),
            ['id', 'name', 'price'],
            'product object contains required keys'
          );
          t.end();
        });
    });
});

test('GET /:shopName/:productId', t => {
  request(app)
    .get(`/${shopName}/${productId}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.error(err, 'no error');
      t.deepEqual(
        Object.keys(res.body),
        ['id', 'name', 'price'],
        'product object contains required keys'
      );
      t.end();
    });
});
