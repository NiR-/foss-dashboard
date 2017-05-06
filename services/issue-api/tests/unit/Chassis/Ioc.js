import chai from 'chai';

const expect = chai.expect;

import {Container} from '../../../lib/Chassis/Ioc';

describe('Container', function () {
  it('holds a circular reference to itself', function () {
    const container = new Container();

    expect(container.has('internal')).to.be.true;
  });
});
