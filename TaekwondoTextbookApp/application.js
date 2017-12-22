var application = angular.module("TaekwondoTextbookApp", []);

application.controller("TextbookController", ["$scope", function ($scope) {

    $scope.numberOfPages = 2;
    $scope.page = 1;

    $scope.previousPage = function () {
        if ($scope.page <= 1) {
            return;
        }
        $scope.page -= 1;
    }

    $scope.nextPage = function () {
        if ($scope.page >= $scope.numberOfPages) {
            return;
        }
        $scope.page += 1;
    }

    $scope.keyPress = function (event) {
        if (event.which == 13) {
            $scope.nextPage();

            event.preventDefault();
        }
    }

}]);