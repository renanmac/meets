const plg = require('pluga-plg');
const expect = require('chai').expect;

const action = require('../../lib/actions/add_opportunity');

const timestamp = Date.now();
const title = `Deal Test-${timestamp}`;
const organizationName = `Org Test-${timestamp}`;
const organizationEmail = `org-${timestamp}@email.com`;

const event = {
  meta:{
    baseURI: process.env.BASE_URI
  },
  auth: {
    token: process.env.TOKEN
  },
  input:{
    descricao: title,
    razao_cliente: organizationName,
    produtos: 2465,
    valor: 1000,
    email_cliente: organizationEmail,
    celular_cliente: '81 99747.0220',
    cpf: '04007356440',
    id_status: 30,
    id_usuario: 45
  }
};

describe('Action: Add Opportunity', () => {
  it('Should add a opportunity', function (done) {
    action.handle(plg, event).then(result => {
      expect(result).to.include({
        codigo: 1
      });

      done();
    }).catch(done);
  });

  it('Should update a opportunity', function (done) {
    action.handle(plg, event).then(result => {
      expect(result).to.include({
        codigo: 1
      });

      done();
    }).catch(done);
  });
});