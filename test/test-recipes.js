const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Recipes', function() {
  // RUN AND CLOSE SERVER
  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });

  // GET INTEGRATION TEST
  it('Should list recipes on GET', function() {
    return chai.request(app)
      .get('./recipes')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.at.least(1);
        res.body.array.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys('id', 'name', 'ingredients');
        });
      })
  });

  // POST INTEGRATION TEST
  it('should add a recipe on POST', function() {
    const newRecipe = {name: 'coffee', ingredients: ['ground coffee', 'hot water']};
    return chai.request(app)
      .post('/recipes')
      .send(newRecipe)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'name', 'ingredients');
        res.body.ingredients.should.be.a('array');
        res.body.ingredients.should.include.members(newRecipe.ingredients);
      });
  });

  // PUT INTEGRATION TEST
  it('should update recipes on PUT', function() {
    const updateData = {
      name: 'foo',
      ingredients: ['bar', 'wam']
    };

    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/recipes/${updateData.id}`)
          .send(updateData);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });

  // DELETE INTEGRATION TEST
  it('should delete recipes on DELETE', function() {
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        return chai.request(app)
          .delete(`/recipes/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
});