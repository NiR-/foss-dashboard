import chai from 'chai';
import sinon from 'sinon';

const expect = chai.expect;
chai.use(require('sinon-chai'));

import {GetStats} from '../../../../lib/domain/messages';
import {RepoNotFoundError} from '../../../../lib/domain/errors';

describe('GetStats', function () {
  it('retrieves stats for specified repository', async function () {
    const stats = {byDay: [{created: 10}]};
    const statsRepository = {getStats: sinon.stub().returns(stats)};

    const container = {statsRepository};
    const message = {repo: 'KnpLabs/Gaufrette'};

    const retrieved = await GetStats.handle(container, message);
    retrieved.should.eq(stats);
  });

  it('throws an exception if the repository have no stats', function (done) {
    const statsRepository = {getStats: sinon.stub().returns(null)};

    const container = {statsRepository};
    const message = {repo: 'KnpLabs/Gaufrette'};

    GetStats
      .handle(container, message)
      .then(() => done('No error thrown.'))
      .catch((err) => {
        done(err instanceof RepoNotFoundError ? null : err);
      });
  });
});
