import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcryptjs from 'bcryptjs';
import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/User';
import Club from '../database/models/Club';
import Match from '../database/models/Match';
import matchObject from '../interfaces/Match';
import { tokenAuth, userFindOneMock } from './mocks/users';
import { clubGetIdMock, clubsGetAllMock } from './mocks/clubs';
import {
  matchCreate,
  matchsInDB,
  matchFindAll,
  matchInProgressFalse,
  matchInProgressTrue,
  ratingsAll,
  ratingsHome,
  ratingsAway,
} from './mocks/matchs';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('ENDPOINT /login (POST)', () => {
  let response: Response;
  let bodyRequest;

  describe('Requisição feita com sucesso com usuário válido', () => {
    before(async () => {
      sinon.stub(User, "findOne").resolves(userFindOneMock as User);
      sinon.stub(bcryptjs, "compare").resolves(true);
    })
    
    after(async () => {
      (User.findOne as sinon.SinonStub).restore();
      (bcryptjs.compare as sinon.SinonStub).restore();
    })

    it('Retorna os dados do usuário', async () => {
      bodyRequest = { email: "admin@admin.com", password: "secret_admin" };
      response = await chai.request(app).post('/login').send(bodyRequest);
      const { user, token } = response.body;

      expect(user.id).to.be.equal(1);
      expect(user.username).to.be.equal("Admin");
      expect(user.role).to.be.equal("admin");
      expect(user.email).to.be.equal("admin@admin.com");
      expect(token).to.be.contains("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
      expect(response.status).to.be.equal(200);
    });
  });

  describe('Requisição feita com usuário inválido', () => {
    before(async () => {
      sinon.stub(User, "findOne").resolves(userFindOneMock as User);
      sinon.stub(bcryptjs, "compare").resolves(false);
    })
    
    after(async () => {
      (User.findOne as sinon.SinonStub).restore();
      (bcryptjs.compare as sinon.SinonStub).restore();
    })

    it('Email do usuário incorreto', async () => {
      bodyRequest = { email: "trybe@trybe.com", password: "secret_admin" };
      response = await chai.request(app).post('/login').send(bodyRequest);
      const { message } = response.body;

      expect(response.status).to.be.equal(401);
      expect(message).to.be.equal("Incorrect email or password");
    });

    it('Password do usuário incorreto', async () => {
      bodyRequest = { email: "admin@admin.com", password: "admin" };
      response = await chai.request(app).post('/login').send(bodyRequest);
      const { message } = response.body;

      expect(response.status).to.be.equal(401);
      expect(message).to.be.equal("Incorrect email or password");
    });
  })

  describe('Requisição feita com dados faltando', async () => {
    before(async () => {
      sinon.stub(User, "findOne").resolves(userFindOneMock as User);
    })
    
    after(async () => {
      (User.findOne as sinon.SinonStub).restore();
    })

    it('Requisição sem o email', async () => {
      bodyRequest = { password: "secret_admin" };
      response = await chai.request(app).post('/login').send(bodyRequest);
      const { message } = response.body;

      expect(response.status).to.be.equal(401);
      expect(message).to.be.equal("All fields must be filled");
    });

    it('Requisição sem o password', async () => {
      bodyRequest = { email: "trybe@trybe.com" };
      response = await chai.request(app).post('/login').send(bodyRequest);
      const { message } = response.body;

      expect(response.status).to.be.equal(401);
      expect(message).to.be.equal("All fields must be filled");
    });
  });
});

describe('ENDPOINT /login/validate (GET)', () => {
  let response: Response;
  const authorization = tokenAuth;

  before(async () => {
    sinon.stub(User, "findOne").resolves(userFindOneMock as User);
  })
  
  after(async () => {
    (User.findOne as sinon.SinonStub).restore();
  })

  it('O token é válido e retorna o role do usuário', async () => {
    response = await chai.request(app)
      .get('/login/validate').set('Authorization', authorization);
    expect(response.body).to.be.equal('admin');
    expect(response.status).to.be.equal(200);
  });
});

describe('ENDPOINT /clubs (GET)', () => {
  let response: Response;
  
  describe('Requisição é feita com sucesso', () => {
    before(async () => {
      sinon.stub(Club, "findAll").resolves(clubsGetAllMock as Club[]);
    })
    
    after(async () => {
      (Club.findAll as sinon.SinonStub).restore();
    })

    it('Retorna um array com os clubs', async () => {
      response = await chai.request(app).get('/clubs');
      expect(response.body).to.deep.equal(clubsGetAllMock);
      expect(response.status).to.be.equal(200);
    });
  });
});

describe('ENDPOINT /clubs/:id (GET)', () => {
  let response: Response;
  
  describe('Requisição é feita com sucesso com o id "1"', () => {
    before(async () => {
      sinon.stub(Club, "findByPk").resolves(clubGetIdMock as Club);
    })
    
    after(async () => {
      (Club.findByPk as sinon.SinonStub).restore();
    })

    it('Retorna um objeto com o club', async () => {
      response = await chai.request(app).get('/clubs/1');
      expect(response.body).to.deep.equal(clubGetIdMock);
      expect(response.status).to.be.equal(200);
    });
  });
});

describe('ENDPOINT /matchs (GET)', () => {
  let response: Response;
  
  describe('Requisição OK -> All matchs', () => {
    before(async () => {
      sinon.stub(Match, "findAll").resolves(matchFindAll as matchObject[]);
    })
    
    after(async () => {
      (Match.findAll as sinon.SinonStub).restore();
    })

    it('Retorna um array com todos os matchs', async () => {
      response = await chai.request(app).get('/matchs');
      expect(response.body).to.deep.equal(matchFindAll);
      expect(response.body).to.be.an('array');
      expect(response.status).to.be.equal(200);
    });
  });

  describe('Requisição OK -> inProgress false matchs', () => {
    before(async () => {
      sinon.stub(Match, "findAll").resolves(matchInProgressFalse as matchObject[]);
    })
    
    after(async () => {
      (Match.findAll as sinon.SinonStub).restore();
    })

    it('Retorna um array com todos os matchs com inProgress igual a false', async () => {
      response = await chai.request(app).get('/matchs?inProgress=false');
      expect(response.body).to.deep.equal(matchInProgressFalse);
      expect(response.body).to.be.an('array');
      expect(response.status).to.be.equal(200);
      expect(response.body[0].inProgress).to.be.equal(false);
      expect(response.body[1].inProgress).to.be.equal(false);
      expect(response.body[2].inProgress).to.be.equal(false);
    });
  });

  describe('Requisição OK -> inProgress true matchs', () => {
    before(async () => {
      sinon.stub(Match, "findAll").resolves(matchInProgressTrue as matchObject[]);
    })
    
    after(async () => {
      (Match.findAll as sinon.SinonStub).restore();
    })

    it('Retorna um array com todos os matchs com inProgress igual a true', async () => {
      response = await chai.request(app).get('/matchs?inProgress=true');
      expect(response.body).to.deep.equal(matchInProgressTrue);
      expect(response.body).to.be.an('array');
      expect(response.status).to.be.equal(200);
      expect(response.body[0].inProgress).to.be.equal(true);
      expect(response.body[1].inProgress).to.be.equal(true);
      expect(response.body[2].inProgress).to.be.equal(true);
    });
  });
});

describe('ENDPOINT /matchs (POST)', () => {
  let response: Response;
  let requestBody = {};
  const authorization = tokenAuth;

  describe('Requisição é feita com sucesso', () => {
    before(async () => {
      sinon.stub(Match, "create").resolves(matchCreate as Match);
    })
    
    after(async () => {
      (Match.create as sinon.SinonStub).restore();
    })

    requestBody = {
      homeTeam: 16,
      awayTeam: 8,
      homeTeamGoals: 2,
      awayTeamGoals: 2,
      inProgress: true
    }

    it('Retorna um objeto da nova partida', async () => {
      response = await chai.request(app).post('/matchs').send(requestBody).set('Authorization', authorization);
      expect(response.body).to.deep.equal(matchsInDB[matchsInDB.length - 1]);
      expect(response.body).to.be.an('object');
      expect(response.status).to.be.equal(201);
    });
  });

  describe('Requisição feita com dois times iguais', () => {
    const requestBodyEqualTeams = {
      homeTeam: 8,
      awayTeam: 8,
      homeTeamGoals: 2,
      awayTeamGoals: 2,
      inProgress: true
    }

    it('Retorna uma mensagem de erro e status 401', async () => {
      response = await chai.request(app).post('/matchs').send(requestBodyEqualTeams).set('Authorization', authorization);
      expect(response.body).to.deep.equal({
        message: 'It is not possible to create a match with two equal teams',
      });
      expect(response.status).to.be.equal(401);
    });
  });

  describe('Requisição feita com time inexistente', () => {
    const requestBodyInvalidTeam = {
      homeTeam: 8,
      awayTeam: 79,
      homeTeamGoals: 2,
      awayTeamGoals: 2,
      inProgress: true
    }

    it('Retorna uma mensagem de erro e status 401', async () => {
      response = await chai.request(app).post('/matchs').send(requestBodyInvalidTeam).set('Authorization', authorization);
      expect(response.body).to.deep.equal({ message: 'There is no team with such id!' });
      expect(response.status).to.be.equal(401);
    });
  });
});

type numberUpdate = Array<number> | any;

describe('ENDPOINT /matchs/:id/finish (PATCH)', () => {
  let response: Response;
  const authorization = tokenAuth;

  describe('Requisição feita com sucesso', () => {
    before(async () => {
      sinon.stub(Match, "update").resolves([1] as numberUpdate);
    })
    
    after(async () => {
      (Match.update as sinon.SinonStub).restore();
    })

    it('Caso a partida não esteja finalizada: Retorna [1] e status 200', async () => {
      response = await chai.request(app).patch('/matchs/41/finish').set('Authorization', authorization);
      expect(response.body).to.deep.equal([1]);
      expect(response.status).to.be.equal(200);
    });
  });
});

describe('ENDPOINT /matchs/:id (PATCH)', () => {
  let response: Response;
  const authorization = tokenAuth;

  describe('Requisição feita com sucesso', () => {
    before(async () => {
      sinon.stub(Match, "update").resolves([1] as numberUpdate);
    })
    
    after(async () => {
      (Match.update as sinon.SinonStub).restore();
    })

    let requestBodyUpdate = {
      homeTeamGoals: 3,
      awayTeamGoals: 1,
    }

    it('Caso a partida não esteja finalizada: Retorna [1] e status 200', async () => {
      response = await chai.request(app).patch('/matchs/41').send(requestBodyUpdate).set('Authorization', authorization);
      expect(response.body).to.deep.equal([1]);
      expect(response.status).to.be.equal(200);
    });
  });
});

describe('ENDPOINT /leaderboard (GET)', () => {
  let response: Response;

  describe('Requisição feita com sucesso', () => {
    before(async () => {
      sinon.stub(Club, "findAll").resolves(clubsGetAllMock as Club[]);
      sinon.stub(Match, "findAll").resolves(matchInProgressFalse as matchObject[]);
    })
    
    after(async () => {
      (Club.findAll as sinon.SinonStub).restore();
      (Match.findAll as sinon.SinonStub).restore();
    })

    it('Retorna um array de objetos com os dados de cada time', async () => {
      response = await chai.request(app).get('/leaderboard');
      expect(response.body).to.deep.equal(ratingsAll);
      expect(response.body).to.be.an('array');
      expect(response.status).to.be.equal(200);
    });
  });
});

describe('ENDPOINT /leaderboard/home (GET)', () => {
  let response: Response;

  describe('Requisição feita com sucesso', () => {
    before(async () => {
      sinon.stub(Club, "findAll").resolves(clubsGetAllMock as Club[]);
      sinon.stub(Match, "findAll").resolves(matchInProgressFalse as matchObject[]);
    })
    
    after(async () => {
      (Club.findAll as sinon.SinonStub).restore();
      (Match.findAll as sinon.SinonStub).restore();
    })

    it('Retorna um array de objetos com os dados de cada time da casa', async () => {
      response = await chai.request(app).get('/leaderboard/home');
      expect(response.body).to.deep.equal(ratingsHome);
      expect(response.body).to.be.an('array');
      expect(response.status).to.be.equal(200);
    });
  });
});

describe('ENDPOINT /leaderboard/away (GET)', () => {
  let response: Response;

  describe('Requisição feita com sucesso', () => {
    before(async () => {
      sinon.stub(Club, "findAll").resolves(clubsGetAllMock as Club[]);
      sinon.stub(Match, "findAll").resolves(matchInProgressFalse as matchObject[]);
    })
    
    after(async () => {
      (Club.findAll as sinon.SinonStub).restore();
      (Match.findAll as sinon.SinonStub).restore();
    })

    it('Retorna um array de objetos com os dados de cada time convidado', async () => {
      response = await chai.request(app).get('/leaderboard/away');
      expect(response.body).to.deep.equal(ratingsAway);
      expect(response.body).to.be.an('array');
      expect(response.status).to.be.equal(200);
    });
  });
});
function before(arg0: () => Promise<void>) {
  throw new Error('Function not implemented.');
}

function after(arg0: () => Promise<void>) {
  throw new Error('Function not implemented.');
}

