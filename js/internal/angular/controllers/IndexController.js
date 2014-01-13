app.controller('IndexController', function($scope) {
    $scope.y = null;
    $scope.refresh = function() {
        log('refresh');
        $scope.y = window.y;
    };
    $scope.swing = function($event) {
        y.receiveInput($event.offsetX, 200 - $event.offsetY);
    }
});