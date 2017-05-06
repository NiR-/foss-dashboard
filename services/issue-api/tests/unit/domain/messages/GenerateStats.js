const chai = require('chai');
const sinon = require('sinon');
chai.should();
chai.use(require('sinon-chai'));

import {GenerateStats} from '../../../../lib/domain/messages';

describe('GenerateStats', function () {
  it('computes and stores stats based on stored issues', async function () {
    const issues = [
      {id: 1, name: 'issue 1'},
      {id: 2, name: 'issue 2', isPR: true}
    ];
    const issueRepository = {findIssues: sinon.stub().returns(issues)};
    const statsPersister = {storeStats: sinon.stub()};

    const deps = {issueRepository, statsPersister};
    const message = {repo: 'KnpLabs/Gaufrette'};

    await GenerateStats.handle(deps, message);

    issueRepository.findIssues.should.have.been.called;
    statsPersister.storeStats.should.have.been.called;
  });
});
