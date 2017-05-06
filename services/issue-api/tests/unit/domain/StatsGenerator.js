import chai from 'chai';

chai.should();

import * as StatsGenerator from '../../../lib/domain/StatsGenerator';

describe('StatsGenerator', function () {
  it('computes empty stats for empty issue collection', function () {
    const stats = StatsGenerator.generateStats([]);
    stats.byDay.should.have.lengthOf(0);
  });
});
