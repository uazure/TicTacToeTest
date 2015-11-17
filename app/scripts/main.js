'use strict';

var app = angular.module('app',[]);
// main controller to interact with user
app.controller('gameController', ['$scope', 'ticTacToeService', function($scope, ticTacToeService) {
    ticTacToeService.start();
    $scope.field = ticTacToeService.getField();
    $scope.state = ticTacToeService.state;
    $scope.click = function (i) {
        ticTacToeService.userTurn(i);
    };
    $scope.start = function() {
        ticTacToeService.start();
    }
}]);

// service with game logic implementation
app.service('ticTacToeService', [function() {
    // initial empty field
    var initialField = [' ',' ',' ',' ',' ',' ',' ',' ',' '];
    var service = {
        field: angular.copy(initialField),
        state: {onAir: false, win: false, draw: false, winner: null}, // initial game state
        start: function() {
            this.init();
            this.state.onAir = true;
            this.state.winner = null;
            this.state.win = false;
            this.state.draw = false;
        },
        /* populate field with default empty values (from initialField) */
        init: function() {
            for (var i=0, len=this.field.length; i<len; ++i) {
                this.field[i] = initialField[i];
            }
        },
        /* handle user turn */
        userTurn: function(i) {
            if (!this.isCellEmpty(i) || !this.state.onAir) {
                return;
            }
            this.field[i] = 'x';
            if (!this.checkGameOver()) {
                this.myTurn();
            };
        },
        /* AI for making a turn :) */
        myTurn: function() {
            // better logic should be placed here
            var cell = this.randomCell();
            while (!this.isCellEmpty(cell)) {
                cell = this.randomCell();
            }
            this.field[cell] = 'o';
            this.checkGameOver();
        },
        /* helper method to generate random cell id */
        randomCell: function() {
            var i = Math.floor(Math.random()*9);
            return i;
        },
        /* helper method to check if cell is empty */
        isCellEmpty: function(i) {
            if (this.field[i] === ' ') {
                return true;
            }
            return false;
        },
        /* helper to check if one of the "win" sequences is complete. Used by checkGameOver */
        checkSequenceComplete: function (sequence) {
            var symbol = sequence[0];
            if (symbol == " ") {
                return false;
            }
            for (var i = 0, len = sequence.length; i < len; ++i) {
                if (sequence[i] != symbol) {
                    return false;
                }
            }
            this.state.win = true;
            this.state.winner = symbol;
            console.log('winner is', symbol);
            return true;
        },
        /* method to check if game is over. Will set this.state.win = true and this.state.winner
        in case of win or will set this.state.draw = true;
        Game also ends when all cells has been filled */
        checkGameOver: function() {
            var f = this.field;
            var variants = [
                [f[0], f[1], f[2]],
                [f[3], f[4], f[5]],
                [f[6], f[7], f[8]],
                [f[0], f[3], f[6]],
                [f[1], f[4], f[7]],
                [f[2], f[5], f[8]],
                [f[0], f[4], f[8]],
                [f[2], f[4], f[6]],
            ];

            var allFieldsFilled = !f.some(function(el){
                if (el == ' ') {
                    return true;
                }
            });

            for (var i = 0, len = variants.length; i < len; ++i) {
                if (this.checkSequenceComplete(variants[i])) {
                    this.state.onAir = false;
                    return true;
                }
            }
            if (allFieldsFilled) {
                this.state.draw = true;
                this.state.onAir = false;
                console.log('Draw game');
                return true;
            }
            // game is not over;
            return false;
        },
        // getter for game field array
        getField: function() {
            return this.field;
        }
    };
    return service;
}])
