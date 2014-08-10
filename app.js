(function() {

    var app = angular.module('testprep', ['ngSanitize']);
    
    app.controller('testprepController', function($scope, DataService){
        $scope.qbank = DataService.qbank
        $scope.selectedQuestion = DataService.selectedItem;
        $scope.setPointer = function(selectedQuestion) {
            DataService.setSelected(selectedQuestion);
        };
        
    });
    
    app.service("DataService", function($http){
      var service = {
        qbank:[],
        selectedItem:{},
        setSelected: function(selectedItem){
          angular.copy(selectedItem, service.selectedItem);
          console.log(service.selectedItem)
        },
        getData: function(){
          $http.get('generated.json').then(function(result) {
              angular.copy(result.data,service.qbank);
              /*service.setSelected(service.qbank[0]) /* this is testview-specific, probably does not belong here once multiple views/selection is integrated */
          })
        }
      };
      service.getData();
      return service;
    });
    
    app.filter("subjectLimit", function() {
      /* intent: take an item and an array of subject strings, compare subjects, if match, return it */
      return function (items, subjects) {
        var filtered = [];
        if (angular.isString(subjects)) {
          subjects = [subjects];
        }
        angular.forEach (items, function(item) {
          if (subjects.indexOf(item.subject.$t) > -1) {
            filtered.push(item);
          }
        })
        return filtered;
      }
    });

})();

