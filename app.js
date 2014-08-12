(function() {

    var app = angular.module('testprep', ['ngSanitize']);
    
    app.controller('testprepController', function($scope, DataService){
        $scope.qbank = DataService.qbank
        $scope.selectedQuestion = DataService.selectedItem;
        $scope.setPointer = function(selectedQuestion) {
            DataService.setSelected(selectedQuestion);
            $scope.mustShow = false;
        };
        
        DataService.getData().then(function(){
          $scope.allSubjects = DataService.getAllSubjects();
        })
        
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
          return $http.get('generated.json').then(function(result) {
              angular.copy(result.data,service.qbank);
              service.setSelected(service.qbank[0]) /* this is testview-specific, probably does not belong here once multiple views/selection is integrated */
              return service.selectedItem;
            
          })
        },
        getAllSubjects: function getAllSubjects() {
            var allSubjects = [];
            for (var i=0;i<service.qbank.length;i++) {
                var subject = service.qbank[i].subject.$t;
                if (!(allSubjects.indexOf(subject) > -1)) {
                    allSubjects.push(subject);
                };
            };
            return allSubjects;
        }
      };
    //  service.getData();
      return service;
    })
})();
