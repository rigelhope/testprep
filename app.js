var app = angular.module('testprep', ['ngSanitize']);

app.controller('testprepController', function($scope,$http){
    var qbank = [];
    var qidList = [];
    var qstem = "";

    $http.get('generated.json').then(function(result) {
        qbank = result.data;
        for (var i=0, l=qbank.length;i<l;i++) {
            qidList.push(qbank[i].id);
        };
        $scope.qidList = qidList;
        $scope.qstem = qbank[0].prompt;
    })

    
});

