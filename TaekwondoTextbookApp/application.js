var application = angular.module("TaekwondoTextbookApp", []);

application.controller("TextbookController", ["$scope", function ($scope) {

    $scope.page = 1;

    $scope.previousPage = function () {
        $scope.page -= 1;
    }

    $scope.nextPage = function () {
        $scope.page += 1;
    }

}]);