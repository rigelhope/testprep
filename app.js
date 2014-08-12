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
              service.setSelected(service.qbank[0]) /* this is testview-specific, probably does not belong here once multiple views/selection is integrated */
          })
        }
      };
      service.getData();
      return service;
    })
})();

