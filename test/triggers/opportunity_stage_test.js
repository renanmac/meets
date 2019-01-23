const plg = require('pluga-plg');
const expect = require('chai').expect;

const trigger = require('../../lib/triggers/opportunity_stage');

describe('Trigger: Change Stage Opportunity', function () {
  it('Should return a list of opportunits', (done)=> {
    const event = {
      meta: {
        baseURI: process.env.BASE_URI,
        lastReqAt: parseInt(process.env.LAST_REQ_AT)
      },
      auth: {
        token: process.env.TOKEN
      },
      input: {
        id_etapa: 19819
      }
    };

    trigger.handle(plg, event).then((results) => {
      results.forEach((deal) => {
        expect(deal.id_etapa).to.eq('19819');
      });

      done();
    }).catch(done);
  });
});
