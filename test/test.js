const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../index')
const should = chai.should()
const expect = chai.expect

chai.use(chaiHttp)

// ---> DEBUT
/**
  * Génération des nouvelles couleurs et enregistrement de ces
  * couleurs dans un tableau.
  */
const newValues = []
const colorKey = 'NEW_COLOR_'
let nextCursor = 0;
const payloadColor = () => {
  const nextColor = `${colorKey}${nextCursor}`
  newValues.push(nextColor)
  nextCursor++;
  return { 'color': nextColor }
}
const getCurrentCulor = () => {
  return nextCursor > 0 ? `${colorKey}${nextCursor - 1}` : `${colorKey}O`
}
// <-- FIN

describe('API TEST', function() {
  it('Should return all colors', function(done){
    chai.request(app)
    .get('/colors')
    .end(function(err, res) {
      res.should.have.status(200)
      res.should.be.json
      res.body.should.be.an('object')
      res.body.results.should.be.an('array')
      done();
    });
  })


  it('Should return 404', function(done){
    chai.request(app)
    .get('/colorssss')
    .end(function(err, res) {
      res.should.have.status(404)
      done();
    });
  })


  it('Should have new color', function(done) {
    chai.request(app)
    .post('/colors')
    .send(payloadColor('green'))
    .end(function(err, res) {
      res.should.have.status(201)
      res.should.to.be.json
      res.should.be.json
      res.body.should.be.an('object')
      res.body.results.should.be.an('array')
      .to.include(getCurrentCulor());
      done();
    })
  })

  it('Should return new color list', function(done) {
    chai.request(app)
    .get('/colors')
    .end(function(err, res) {
      res.should.have.status(200)
      res.should.to.be.json
      res.should.be.json
      res.body.should.be.an('object')
      res.body.results.should.be.an('array')
      .to.include(getCurrentCulor());
      done();
    });
  })
})