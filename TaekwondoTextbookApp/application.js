var application = angular.module("TaekwondoTextbookApp", ["ngSanitize"]);

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

application.directive("page", function () {
    return {
        restrict: "E",
        scope: {
        },
        templateUrl: "page.html",
        link: function (scope) {

        }
    };
});

application.directive("compile", ["$compile", function ($compile) {
    return function (scope, element, attributes) {
        scope.$watch(function (scope) {
            return scope.$eval(attributes.compile);
        }, function (value) {
            element.html(value);
            $compile(element.contents())(scope);
        });
    };
}]);

application.controller("TextbookController", ["$scope", "$http", function ($scope, $http) {

    $scope.numberOfPages = 3;
    $scope.page = 1;

    $scope.pages = [];
    $scope.data = {};

    $scope.getPart = function () {
        $http.get("prepositions/part.json").then(function (response) {
            var part = response.data;

            $scope.getPages(part.pages);
            $scope.getData(part.data);

            console.log($scope.pages);
        });
    }

    $scope.getPages = function (pages) {
        for (var i = 0; i < pages.length; i++) {
            $http.get("prepositions/" + pages[i]).then(function (response) {
                var url = response.config.url;
                var pageName = url.slice(13);
                var index = pages.indexOf(pageName) + 1;

                $scope.pages.push({ index: index, html: response.data });
            });
        }
    }

    $scope.getData = function (dataFiles) {
        for (var i = 0; i < dataFiles.length; i++) {
            $http.get("prepositions/" + dataFiles[i]).then(function (response) {
                var name = response.data.name;

                if (response.data.type == "vocabulary multiple choice") {
                    var exerciseData = convertExerciseData(response.data);

                    $scope.data[name] = exerciseData;
                }
                else {
                    $scope.data[name] = response.data.items;
                }
            });
        }
    }

    $scope.getPart();

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
        if (event.which == 13 || event.which == 39) {
            $scope.nextPage();

            event.preventDefault();
        }
        if (event.which == 37) {
            $scope.previousPage();

            event.preventDefault();
        }
    }

}]);