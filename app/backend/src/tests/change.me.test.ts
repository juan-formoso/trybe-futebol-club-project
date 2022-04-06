import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';
import UserModel from '../database/models/User';
import ClubModel from '../database/models/Club';
import MatchModel from '../database/models/Match';

import { Response } from 'superagent';
import IUser from '../interfaces/User';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testando rota /login', () => {
  let chaiHttpResponse: Response;

  const userMock: any = {
    id: 1,
    username: 'Admin',
    role: 'admin',
    email: 'admin@admin.com',
    password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW',
  }

  const notUserMock = undefined;

  describe('Testando quando não há usuario cadastrado', () => {
    before(async () => {
      sinon
        .stub(UserModel, "findOne")
        .resolves(notUserMock);
      chaiHttpResponse = await chai.request(app).post('/login').send({
        "email": "admin@admin.com.br",
        "password": "secret_admin2"
      });
    });
  
    after(()=>{
      (UserModel.findOne as sinon.SinonStub).restore();
    });
  
    it('O endpoint post /login deve retornar o status 404', async () => {
      expect(chaiHttpResponse).to.have.status(404);
    });
  
    it('O endpoint post /login deve retornar um objeto', async () => {
      expect(chaiHttpResponse).to.be.an('object');
    });
  });

  describe('Testando quando o campo de email está vazio no método post', () => {
    before(async () => {
      sinon
        .stub(UserModel, "findOne")
        .resolves(userMock);
      chaiHttpResponse = await chai.request(app).post('/login').send({ "password": "secret_admin" });
    });
  
    after(()=>{
      (UserModel.findOne as sinon.SinonStub).restore();
    });
  
    it('O endpoint post /login deve retornar o status 401', async () => {
      expect(chaiHttpResponse).to.have.status(401);
    });
  
    it('O endpoint post /login deve retornar um objeto', async () => {
      expect(chaiHttpResponse).to.be.an('object');
    });
  });

  describe('Testando quando o campo de email invalido', () => {
    before(async () => {
      sinon
        .stub(UserModel, "findOne")
        .resolves(userMock);
      chaiHttpResponse = await chai.request(app).post('/login').send({
        "email": "admin@admin",
        "password": "secret_admin"
      });
    });
  
    after(()=>{
      (UserModel.findOne as sinon.SinonStub).restore();
    });
  
    it('O endpoint post /login deve retornar o status 401', async () => {
      expect(chaiHttpResponse).to.have.status(401);
    });
  
    it('O endpoint post /login deve retornar um objeto', async () => {
      expect(chaiHttpResponse).to.be.an('object');
    });
  });

  describe('Testando quando o campo de password está vazio no método post', () => {
    before(async () => {
      sinon
        .stub(UserModel, "findOne")
        .resolves(userMock);
      chaiHttpResponse = await chai.request(app).post('/login').send({
        "email": "admin@admin.com"
      });
    });
  
    after(()=>{
      (UserModel.findOne as sinon.SinonStub).restore();
    });
  
    it('O endpoint post /login deve retornar o status 401', async () => {
      expect(chaiHttpResponse).to.have.status(401);
    });
  
    it('O endpoint post /login deve retornar um objeto', async () => {
      expect(chaiHttpResponse).to.be.an('object');
    });
  });

  describe('Testando quando o campo de password invalido', () => {
    before(async () => {
      sinon
        .stub(UserModel, "findOne")
        .resolves(userMock);
      chaiHttpResponse = await chai.request(app).post('/login').send({
        "email": "admin@admin.com",
        "password": "adm"
      });
    });
  
    after(()=>{
      (UserModel.findOne as sinon.SinonStub).restore();
    });
  
    it('O endpoint post /login deve retornar o status 401', async () => {
      expect(chaiHttpResponse).to.have.status(401);
    });
  
    it('O endpoint post /login deve retornar um objeto', async () => {
      expect(chaiHttpResponse).to.be.an('object');
    });
  });

  describe('Testando caso de sucesso método get', () => {
    before(async () => {
      sinon
        .stub(UserModel, "findOne")
        .resolves(userMock);
      chaiHttpResponse = await chai.request(app).get('/login');
    });
  
    after(()=>{
      (UserModel.findOne as sinon.SinonStub).restore();
    });
  
    it('O endpoint get /login deve retornar o status 200', async () => {
      expect(chaiHttpResponse).to.have.status(200);
    });
  
    it('O endpoint get /login deve retornar um objeto', async () => {
      expect(chaiHttpResponse).to.be.an('object');
    });
  });

  describe('Testando caso de sucesso do método post', () => {
    before(async () => {
      sinon
        .stub(UserModel, "findOne")
        .resolves(userMock);
      chaiHttpResponse = await chai.request(app).post('/login').send({
        "email": "admin@admin.com",
        "password": "secret_admin"
      });
    });
  
    after(()=>{
      (UserModel.findOne as sinon.SinonStub).restore();
    });
  
    it('O endpoint post /login deve retornar o status 200', async () => {
      expect(chaiHttpResponse).to.have.status(200);
    });
  
    it('O endpoint post /login deve retornar um objeto', async () => {
      expect(chaiHttpResponse).to.be.an('object');
    });
  });
});

describe('Testando rota /login/validation', () => {
  let chaiHttpResponse: Response;

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjQ4MDY2OTAwfQ.fKZ-7JtVDJtq3o2W0qut3vD7S3ralS9xdnPnHmaxGvc';
  
  describe('Testando caso de sucesso', async () => {
    chaiHttpResponse = await chai.request(app).get('/login/validate').set({authorization: token});

    it('Deve retornar status 200', async () => {
      expect(chaiHttpResponse).to.have.status(200);
    });

    it('Deve retornar uma string contendo o valor de "role"', async () => {
      expect(chaiHttpResponse).to.be.an('string');
    });
  });

  describe('Testando caso não seja enviado um token', async () => {
    chaiHttpResponse = await chai.request(app).get('/login/validate').set({});

    it('Deve retornar status 404', async () => {
      expect(chaiHttpResponse).to.have.status(404);
    });

    it('Deve retornar uma objeto contendo a mensagem de erro', async () => {
      expect(chaiHttpResponse).to.be.an('object');
    });
  });
});

describe('Testando rota  /clubs', () => {
  let chaiHttpResponse: Response;

  const clubsMock: any = [
    {
      "id": 1,
      "clubName": "Avaí/Kindermann"
    },
    {
      "id": 2,
      "clubName": "Bahia"
    },
    {
      "id": 3,
      "clubName": "Botafogo"
    },
  ];

  describe('Testando caso de sucesso do método get', () => {
    before(async () => {
      sinon
        .stub(ClubModel, "findAll")
        .resolves(clubsMock);
      chaiHttpResponse = await chai.request(app).get('/clubs');
    });
  
    after(()=>{
      (ClubModel.findAll as sinon.SinonStub).restore();
    });

    it('O endpoint get /clubs deve retornar o status 200', async () => {
      expect(chaiHttpResponse).to.have.status(200);
    });

  
    it('O endpoint get /clubs deve retornar um objeto', async () => {
      expect(chaiHttpResponse).to.be.an('object');
    });
  });
});

describe('Testando rota  /clubs/:id', () => {
  let chaiHttpResponse: Response;

  const clubMock: any = [
    {
      "id": 1,
      "clubName": "Avaí/Kindermann"
    },
  ];

  describe('Testando caso de sucesso do método get', () => {
    before(async () => {
      sinon
        .stub(ClubModel, "findByPk")
        .resolves(clubMock.id);
      chaiHttpResponse = await chai.request(app).get('/clubs/:id');
    });
  
    after(()=>{
      (ClubModel.findByPk as sinon.SinonStub).restore();
    });

    it('O endpoint get /clubs/:id deve retornar o status 200', async () => {
      expect(chaiHttpResponse).to.have.status(200);
    });
    
  
    it('O endpoint get /clubs/:id deve retornar um objeto', async () => {
      expect(chaiHttpResponse).to.be.an('object');
    });
  });
});

describe('Testando rota  /matchs', () => {
  let chaiHttpResponse: Response;

  const matchsMock: any = [
    {
      "id": 1,
      "homeTeam": 16,
      "homeTeamGoals": 1,
      "awayTeam": 8,
      "awayTeamGoals": 1,
      "inProgress": false,
      "homeClub": {
        "clubName": "São Paulo"
      },
      "awayClub": {
        "clubName": "Grêmio"
      }
    },
  ];

  describe('Testando caso de sucesso do método get', () => {
    before(async () => {
      sinon
        .stub(MatchModel, "findAll")
        .resolves(matchsMock);
      chaiHttpResponse = await chai.request(app).get('/matchs');
    });
  
    after(()=>{
      (MatchModel.findAll as sinon.SinonStub).restore();
    });

    it('O endpoint get /matchs deve retornar o status 200', async () => {
      expect(chaiHttpResponse).to.have.status(200);
    });

  
    it('O endpoint get /matchs deve retornar um objeto', async () => {
      expect(chaiHttpResponse).to.be.an('object');
    });
  });
});
function before(arg0: () => Promise<void>) {
  throw new Error('Function not implemented.');
}

function after(arg0: () => void) {
  throw new Error('Function not implemented.');
}

