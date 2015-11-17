/* global describe, it */

(function () {
  'use strict';
  //angular.module('app', [])

  beforeEach(module('app'));
  var $service;

  beforeEach(inject(function(_ticTacToeService_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $service = _ticTacToeService_;
  }));
  describe('Test TicTacToe game logic', function () {
    describe('Initial board state', function () {
      it('should not contain "x" or "o" and contain " "', function () {
        expect($service.field).not.toContain('x');
        expect($service.field).not.toContain('o');
        expect($service.field).toContain(' ');
        expect($service.state.onAir).toBe(false);
        $service.start();
        expect($service.state.onAir).toBe(true);
        expect($service.state.win).toBe(false);
        expect($service.state.draw).toBe(false);
      });
    });
    describe('Game flow', function() {
        it('should react on user turn', function() {
            $service.start();
            $service.userTurn(1);
            expect($service.field).toContain('x');
            expect($service.field).toContain('o');
        });
    });
  });
})();
