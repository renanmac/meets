const plg = require('pluga-plg');
const expect = require('chai').expect;

const trigger = require('../../lib/triggers/opportunity_lost');

describe('Trigger: Lost Opportunity', function () {
  it('Should return a list of opportunits', (done)=> {
    const event = {
      meta: {
        baseURI: process.env.BASE_URI,
        lastReqAt: parseInt(process.env.LAST_REQ_AT)
      },
      auth: {
        token: process.env.TOKEN
      }
    };

    trigger.handle(plg, event).then((results) => {
      results.forEach((deal) => {
        expect(deal.status).to.eq('P');
      });

      done();
    }).catch(done);
  });
});
