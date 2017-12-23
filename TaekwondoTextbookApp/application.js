var application = angular.module("TaekwondoTextbookApp", []);

function reorderRandomly(array) {
    var currentIndex = array.length;
    var randomIndex = 0;
    var temporaryValue;

    while (currentIndex > 0) {
        randomIndex = Math.round(Math.random() * (currentIndex - 1));
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function convertExerciseData(exerciseData) {
    for (var i = 0; i < exerciseData.questions.length; i++) {
        var question = exerciseData.questions[i];

        question.answers = [];
        question.answers.push({ text: question.correctAnswer, isCorrect: true, isSelected: false });

        for (var j = 0; j < question.incorrectAnswers.length; j++) {
            var incorrectAnswer = question.incorrectAnswers[j];

            question.answers.push({ text: incorrectAnswer, isCorrect: false, isSelected: false });
        }

        question.answers = reorderRandomly(question.answers);
    }

    return exerciseData;
}

application.directive("vocabularyTable", function () {
    return {
        restrict: "E",
        scope: {
            items: "=data"
        },
        templateUrl: "vocabulary-table.html",
        link: function (scope) {

        }
    };
});

application.directive("vocabularyMultipleChoiceExercise", function () {
    return {
        restrict: "E",
        scope: {
            data: "=data"
        },
        templateUrl: "vocabulary-multiple-choice-exercise.html",
        link: function (scope) {

            scope.selectAnswer = function (question_index, answer_index) {
                var question = scope.data.questions[question_index];

                for (var i = 0; i < question.answers.length; i++) {
                    var answer = question.answers[i];

                    answer.isSelected = false;
                    if (i == answer_index) {
                        answer.isSelected = true;
                    }
                }
            }

            scope.checkAnswers = function () {
                for (var i = 0; i < scope.data.questions.length; i++) {
                    var question = scope.data.questions[i];
                    question.gotAnswerCorrect = false;

                    for (var j = 0; j < question.answers.length; j++) {
                        var answer = question.answers[j];

                        if (answer.isCorrect && answer.isSelected) {
                            question.gotAnswerCorrect = true;
                            break;
                        }
                    }
                }

                scope.showResponses = true;
            }
        }
    };
});

application.controller("TextbookController", ["$scope", "$http", function ($scope, $http) {

    $scope.numberOfPages = 3;
    $scope.page = 1;

    $scope.exercise1Data = {};
    $scope.showResponses = false;

    $scope.vocabularyList1 = {};
    $scope.vocabularyList2 = {};

    $scope.getData = function () {

        $http.get("prepositions/vocabulary-list-1.json").then(function (response) {
            $scope.vocabularyList1 = response.data.items;
        });

        $http.get("prepositions/vocabulary-list-2.json").then(function (response) {
            $scope.vocabularyList2 = response.data.items;
        });

        $http.get("prepositions/exercise-1.json").then(function (response) {
            $scope.exercise1Data = convertExerciseData(response.data);
        });
    }

    $scope.getData();

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