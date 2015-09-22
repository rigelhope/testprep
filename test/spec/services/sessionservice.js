'use strict'

describe('session service', function() {

  var SessionService, localForage;
  beforeEach(function() {
    module('testprepApp');
    inject(function(_SessionService_) {
      SessionService = _SessionService_;
    });
  });

  it('gets available sessions', function() {
    return true;
  });

  it('can delete an existing session', function() {
    return true;
  });

  it('can store a session', function() {
    return true;
  });

  it('has a fallback option if no sessions are found', function() {
    return true;
  });

});
