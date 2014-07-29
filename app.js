(function() {

    var app = angular.module('testprep', ['ngSanitize']);
    
    app.controller('testprepController', function($scope,$http){
        var qbank = [];
        var qidList = [];
        var qstem = "";
        var qexplanation="";

        function setPointer(newQID) {
            /* make an object that has all the relevant stuff to change, and return that */
        };
    
        $http.get('generated.json').then(function(result) {
            qbank = result.data;
            for (var i=0, l=qbank.length;i<l;i++) {
                qidList.push(qbank[i].id);
            };
            $scope.qidList = qidList;
    
            /* this can actually go in a setter function, and initialize the array pointer to [0] */
            $scope.qstem = qbank[0].prompt;
            $scope.answerList = qbank[0].answerList;
            $scope.qexplanation = qbank[0].explanation;
        })
        
    });
})();
