const app = require('../lib/app')();
const request = require('supertest');
const test = require('tape');

const productId = 'KF-090';
const shopName = 'niko-opt';

test.onFinish(() => require('../lib/redis').quit());

test('GET /ui unauthorized', t => {
  request(app)
    .get('/ui')
    .expect(401)
    .end(t.end);
});

test('GET /ui', t =>
  request(app)
    .get('/ui')
    .set('Authorization', 'test')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.error(err, 'no error');
      t.ok(
        Array.isArray(res.body) && res.body.length,
        'response is a non empty array'
      );
      t.deepEqual(
        Object.keys(res.body[0]),
        ['id', 'name', 'url'],
        'shop object contains required keys'
      );
      t.end();
    }));

test('GET /ui/:shopName/:productId unauthorized', t => {
  request(app)
    .get(`/ui/${shopName}/${productId}`)
    .expect(401)
    .end(t.end);
});

test('GET /ui/:shopName/:productId', t =>
  request(app)
    .get(`/ui/${shopName}/${productId}`)
    .set('Authorization', 'test')
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
    }));
