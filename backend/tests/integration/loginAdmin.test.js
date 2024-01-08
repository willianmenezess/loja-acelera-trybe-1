const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const app = require('../../src/app');
const connection = require('../../src/models/connection');

chai.use(chaiHttp);
const { expect } = chai;

const routeLogin = '/login/admin';
const identifier = '228.564.570-88';

describe('Login admin', function () {
  beforeEach(function () { return sinon.stub(console, 'error').returns(); });
  afterEach(function () { return sinon.restore(); });

  it('working', async function () {
    sinon.stub(connection, 'execute').resolves([[{ 
      identifier, 
      password: '123456',
      isAdmin: true, 
    }]]);
    
    const response = await chai.request(app).post(routeLogin).send({
      identifier, password: '123456',
    });

    const { body, status } = response;

    expect(status).to.be.equal(200);
    expect(body).to.include.all.keys(['token']);

    sinon.restore();
  });
  describe('failing', function () {
    const errorMessage = 'Identifier or password incorrect';
    afterEach(function () { return sinon.restore(); });
    it('not admin', async function () {
      sinon.stub(connection, 'execute').resolves([[{ 
        identifier, 
        password: '123456',
        isAdmin: false, 
      }]]);
      
      const response = await chai.request(app).post(routeLogin).send({
        identifier, password: '123456',
      });
  
      const { body, status } = response;
  
      expect(status).to.be.equal(401);

      expect(body).to.include.all.keys(['message']);

      expect(body.message).to.be.equal(errorMessage);

      sinon.restore();
  
      sinon.restore();
    });
    it('by identifier', async function () {
      sinon.stub(connection, 'execute').resolves([[]]);
    
      const response = await chai.request(app).post(routeLogin).send({
        identifier: '228.564.570-88', password: '123456',
      });

      const { body, status } = response;

      expect(status).to.be.equal(401);

      expect(body).to.include.all.keys(['message']);

      expect(body.message).to.be.equal(errorMessage);

      sinon.restore();
    }); 

    it('by password ', async function () {
      sinon.stub(connection, 'execute').resolves([[{ identifier, password: '123456' }]]);
    
      const response = await chai.request(app).post(routeLogin).send({
        identifier, password: '123457',
      });

      const { body, status } = response;

      expect(status).to.be.equal(401);

      expect(body).to.include.all.keys(['message']);

      expect(body.message).to.be.equal(errorMessage);

      sinon.restore();
    }); 
    it('by req body identifier', async function () {
      const response = await chai.request(app).post(routeLogin).send({
        identifier: '', password: '123457',
      });

      const { body, status } = response;

      expect(status).to.be.equal(422);

      expect(body).to.include.all.keys(['message']);

      expect(body.message).to.be.equal('"identifier" is not allowed to be empty');

      sinon.restore();
    }); 
    it('by req body password', async function () {
      const response = await chai.request(app).post(routeLogin).send({
        identifier, password: '123',
      });

      const { body, status } = response;

      expect(status).to.be.equal(422);

      expect(body).to.include.all.keys(['message']);

      expect(body.message).to.be.equal('"password" length must be at least 6 characters long');

      sinon.restore();
    }); 
  });
});
