(function() {

    var app = angular.module('testprep', ['ngSanitize']);
    
    app.controller('testprepController', function($scope,$http){
        var qbank = [];
        var qidList = [];
        


        function setPointer(newIndex) {
            var i = qidList.indexOf(newIndex);
            $scope.qstem = qbank[i].prompt;
            $scope.qanswerList = qbank[i].answerList;
            $scope.qexplanation = qbank[i].explanation;
            $scope.currentIndex = newIndex;
        };
    
        $http.get('generated.json').then(function(result) {
            qbank = result.data;
            for (var i=0, l=qbank.length;i<l;i++) {
                qidList.push(qbank[i].id);
            };
            $scope.qidList = qidList;
            setPointer(qidList[0]);
    
        })
        
    });
})();
