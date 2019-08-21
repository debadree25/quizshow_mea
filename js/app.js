var app = angular.module("QuizApp", ['ngRoute']);

//Data
var userData = {name: '', score: 0, n_answered: 0,gift : 'whatever'};
var n_question_sets = 10;

//Controllers :
app.controller("MainController", ['$scope', 'StyleService', function ($scope, StyleService) {
        $scope.styleService = StyleService;
    }]);

app.controller("HomeController", ['$scope', function ($scope) {
        $scope.styleService.set('home');
        $scope.welcomeMsg = "Welcome To MindSpark@MEA";
        $scope.changeMsg = function () {
            if ($scope.welcomeMsg === "Welcome To MindSpark@MEA")
                $scope.welcomeMsg = "Let's start off!!";
            else
                $scope.welcomeMsg = "Welcome To MindSpark@MEA";
        };
    }]);

app.controller("SignupController", ['$scope', function ($scope) {
        $scope.styleService.set('signup');
        $scope.name = '';
        $scope.saveInfo = function () {
            userData.name = $scope.name;
        };
    }]);

app.controller("WelcomeController", ['$scope', function ($scope) {
        $scope.styleService.set('welcome');
        $scope.nm = userData.name;
        $scope.cl = userData.cls;
    }]);

app.controller("QuizController", ['$scope', '$http', '$interval', function ($scope, $http, $interval) {
        $scope.styleService.set('quiz');
        var qa = null, ind = 0, fl;
        var shuffle = function (array) {
            var currentIndex = array.length, temporaryValue, randomIndex;
            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        };
        var decrease = function () {
            if ($scope.player.marks > 5)
                $scope.player.marks -= 5;
            console.log("Marks decreased !!");
        };
        var update = function () {
            $interval.cancel();
            if (!(qa[ind] === undefined)) {
                $scope.player.presentQ = qa[ind];
                $scope.player.presentQ.options = shuffle($scope.player.presentQ.options);
                $scope.player.marks = 15;
                //$interval(decrease, 30000);
            } else {
                end();
            }
        };
        var end = function () {
            userData.score = $scope.player.score;
            window.location.href = "#credits";
        };
        fl = "questions/questions" + Math.floor(Math.random() * n_question_sets) + ".json";
        console.log("Requesting for question set :"+fl);
        $scope.player = {marks: 15, score: 0, presentQ: {}, ans: ''};
        $http.get(fl).then(
                function (response) {
                    qa = response.data;
                    qa = shuffle(qa);
                    update();
                },
                function (response) {
                    console.log("Problem !!");
                }
        );
        $scope.checkAns = function () {
            if ($scope.player.presentQ.answer === $scope.player.ans) {
                alert("You are correct");
                ind++;
                userData.n_answered++;
                $scope.player.score += $scope.player.marks;
                update();
            } else {
                alert("You are wrong !! correct answer : " + $scope.player.presentQ.answer);
                end();
            }
        };
    }]);

app.controller('CreditsController', ['$scope','$http', function ($scope,$http) {
        $scope.styleService.set('credits');
        $scope.name = userData.name;
        $scope.score = userData.score;
        $scope.n_answered = userData.n_answered;
		$scope.gift = userData.gift;
        $http.post('/leaderboard.json',JSON.stringify(userData)).then(
            function(reseponse) {
                console.log("Success");
            },
            function(response) {
                console.log("Error");
            }
        );
    }]);

//Services:
app.factory('StyleService', [function () {
        var clss = 'home';
        return {
            set: function (cl) {
                clss = cl;
            },
            get: function () {
                return clss;
            }
        };
    }]);

//Route Provider 
app.config(function ($routeProvider) {
    $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'views/home.html'
            })
            .when('/signup', {
                controller: 'SignupController',
                templateUrl: 'views/sign-up.html'
            })
            .when('/welcome', {
                controller: 'WelcomeController',
                templateUrl: 'views/welcome.html'
            })
            .when('/quiz', {
                controller: 'QuizController',
                templateUrl: 'views/quiz.html'
            })
            .when('/credits', {
                controller: 'CreditsController',
                templateUrl: 'views/credits.html'
            })
            .otherwise({
                redirectTo: '/'
            });
});