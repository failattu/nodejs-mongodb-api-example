var assert = require('assert');
var request = require('supertest');
var mockery = require('mockery');

var jwt = require('jsonwebtoken');
var config = require('../app/config');

var seeds = require('./seeds');

var Post = require("../app/models/post");
var User = require("../app/models/user");

var awsMock = require("./mocks/aws");

describe('Posts', function() {
  var app, token;

  before(function() {
    mockery.enable({
      warnOnUnregistered: false,
      useCleanCache: true
    });
    mockery.registerMock('./controllers/aws', awsMock);

    app = require('../app');

    seeds.clear();
    seeds.createPost();

    var user = new User({
      email: 'other@mrako.com',
      password: 'test'
    });

    user.save(function(err, result) {
      result.token = jwt.sign(result, config.secret);
      token = result.token;
      result.save(function(err, doc) {});
    });
  });

  after(function() {
    seeds.clear();
    mockery.disable();
  });

  it('should authenticate user', function(done) {
    request(app)
      .get('/posts')
      .expect(403)
      .end(function(err, res) {
        done();
      });
  });

  it('returns a list of posts', function(done) {
    request(app)
      .get('/posts')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end(function(err, res) {
        assert.equal(res.body.posts.length, 1);
        done();
      });
  });


  it('creates a new post', function(done) {
    var today = new Date();
    var nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

    request(app)
      .post('/posts')
      .send({
        name: 'An example post',
        description: "A description of my post."
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end(function(err, res) {
        assert.equal(res.body.post.name, 'An example post');
        done();
      });
  });

  it('attaches an image to the post', function(done) {
    request(app)
      .post('/posts')
      .field('name', 'Another example post')
      .field('description', 'Another description')
      .attach('image', 'test/fixtures/dyson.jpg')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end(function(err, res) {
        assert.equal(res.body.post.name, 'Another example post');
        done();
      });
  });
});