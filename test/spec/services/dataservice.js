'use strict';



describe('Service: DataService', function () {

  // load the service's module
  beforeEach(module('testprepApp'));


  // instantiate service
  var DataService;
  beforeEach(inject(function (_DataService_) {
    DataService = _DataService_;
  }));

//  it gets json data and loads it into local memory (qbank)
  it('gets json data and loads it into a local object', function() {
    DataService.fetchData('generated.json').then(function() {
      expect(DataService.qbank.length).toBeGreaterThan(0);
    });
  });

//
//  it puts some or all of the json into a presentation queue
  it('puts some or all of the data into a presentation queue', function() {
    DataService.fetchData('generated.json').then(function(service) {
      service.loadQuestions(service.qbank)}).then(function() {
        expect(DataService.qbank).toEqual(DataService.questions);
      });
  });

//        
//  it makes a list of unique "subject" elements
  it('makes a list of unique "subject" elements', function() {
    DataService.fetchData('generated.json').then(function() {
      expect(DataService.subjects.length).toBeGreaterThan(0);
    });
  });

//
//  it collects information about the "tag" element


//
//  it puts a subset of elements into a presentation queue
  it('puts some of the data into a presentation queue', function() {
    DataService.fetchData('generated.json').then(function(service) {
      service.loadQuestions(service.qbank)}).then(function() {
        expect(DataService.qbank).toEqual(DataService.questions);
      });
  });


//
//    it filters the queue based on the 'subject' element


//
//    it filters the queue based on a "tag" element


//
//  it shuffles the presentation queue
//


//  it pushes the presentation queue to storage
//

//
});

describe('persistent storage', function() {
  var localForage;
  beforeEach(module('LocalForageModule'));
  it('tests add operations', function() {
    inject(function($localForage) {
      localForage = $localForage;
      localForage.setItem('foo', 'bar').then(function(){
        localForage.getItem('foo').then(function(data) {
          expect(data).toBe('bar');
        });
      });
    });
  });
});

describe('elaborate test', function() {
  // note we don't even include the local forage module anymore.
  beforeEach(function() {
    module('testprepApp', function($provide) {
      var localForageMock = {
        foo: jasmine.createSpy('foo')
      };
      $provide.value('$localForage', localForageMock);
    });
  });
  
  it('pushes stuff to localforage', function() {
    inject(function($localForage) {
      //doStuff();
      expect($localForage.foo).toHaveBeenCalled();
    });
  });
});
