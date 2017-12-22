var application = angular.module("TaekwondoTextbookApp", []);

var exercise1Data = {
    type: "vocabulary multiple choice",
    questions: [
        { term: "front", correctAnswer: "ap", incorrectAnswers: ["yeop", "dwit", "an"] },
        { term: "rear", correctAnswer: "dwit", incorrectAnswers: ["ap", "yeop", "an"] },
        { term: "side", correctAnswer: "yeop", incorrectAnswers: ["ap", "an", "mit"] }]
};

application.controller("TextbookController", ["$scope", function ($scope) {

    $scope.numberOfPages = 3;
    $scope.page = 1;

    $scope.exercise1Data = exercise1Data;

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