'use strict'

describe('session service', function() {

  var SessionService;

  beforeEach(function(done) {
    module('testprepApp');
    inject(function(_SessionService_) {
      SessionService = _SessionService_;
    });
    done();
  });

  it('can clear existing stored data', function(done) {
//    SessionService.clearAllSessions().then(function() {
//      expect(SessionService.length).toBe(0);
//    });
    SessionService.clearAllSessions();
    SessionService.length().then(function(len) {
      expect(len).toBe(0);
    });
    done();
  });

  it('can add and remove sessions', function(done) {
    SessionService.addSession('foo',{});
    SessionService.listSessions().then(function(sessions) {
      console.log(sessions);
      expect(sessions).toInclude('foo')
    });
    SessionService.deleteSession('foo');
    SessionService.listSessions().then(function(sessions) {
      expect(sessions).not.toInclude('foo');
    });
    done();
  });

  it('has a fallback option if no sessions are found', function(done) {
    var content = SessionService.getSession('foo')
    console.log(content);
    expect(content).toBeDefined();
    done();
  });

});
