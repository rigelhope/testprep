'use strict';



describe('Service: DataService', function () {

  // load the service's module
  //beforeEach(module('testprepApp'));


  // instantiate service
  var DataService;
  beforeEach(function() {
      //load service's module
      module('testprepApp');

      //inject DataService, connect an outside variable to it
      inject(function (_DataService_) {
        DataService = _DataService_;
      });

      //let's see if i can move the fetchData out here to DRY
//      DataService.fetchData('generated.json');

  });

//  it gets json data and loads it into local memory (qbank)
  it('gets json data and loads it into a local object', function() {
    DataService.fetchData('generated.json').then(function() {
      expect(DataService.qbank.length).toBeGreaterThan(0);
    });
//    expect(DataService.qbank.length).toBeGreaterThan(0);
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
  xit('makes a list of unique "subject" elements', function() {
    DataService.fetchData('generated.json').then(function() {
      expect(DataService.subjects.length).toBeGreaterThan(0);
    });
  });

//
//  it collects information about the "tag" element


//
//  it puts a subset of elements into a presentation queue
  xit('puts some of the data into a presentation queue', function() {
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
  beforeEach(function() {
      module('LocalForageModule');
      inject(function($localForage) {
          localForage = $localForage;
      });
  });

  it('tests clear function', function() {
    localForage.clear().then(function() {
      expect(localForage.length).toBe(0);
    });
  });

  it('tests add operations', function() {
    localForage.setItem('foo', 'bar').then(function(){
      localForage.getItem('foo').then(function(data) {
        expect(data).toBe('bar');
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
  
  xit('pushes stuff to localforage', function() {
    inject(function($localForage) {
      //doStuff();
      expect($localForage.foo).toHaveBeenCalled();
    });
  });
});
