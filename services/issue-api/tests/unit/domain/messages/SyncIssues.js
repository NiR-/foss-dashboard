const chai = require('chai');
const sinon = require('sinon');
chai.should();
chai.use(require('sinon-chai'));

import {SyncIssues} from '../../../../lib/domain/messages';

describe('SyncIssues', function () {
  it('fetches issues and store them', async function () {
    const issues = [{id: 1, name: 'Something goes wrong'}, {id: 2, name: 'A fix', isPR: true}];
    const issueFetcher = {fetchIssues: sinon.stub().returns(issues)};
    const issuePersister = {storeIssues: sinon.stub().withArgs(issues)};

    const container = {issueFetcher, issuePersister};
    const message = {repo: 'KnpLabs/Gaufrette'};

    await SyncIssues.handle(container, message);

    issueFetcher.fetchIssues.should.have.been.called;
    issuePersister.storeIssues.should.have.been.called;
  });
});
