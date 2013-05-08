# angular-hammer

angular-hammer is a [Hammer.js](http://eightmedia.github.io/hammer.js/) adapter for [AngularJS](http://angularjs.org/). It gives a possibility to use directives which handle Hammer.js gestures.

angular-hammer defines a single directive for each gesture. The directives are build in the following way: `hammer-{hammer_gesture}`, for instance `hammer-tap`. [Here](https://github.com/EightMedia/hammer.js/wiki/Getting-Started#gesture-events) you can find all available gestures.

## Usage

### Installation

Include `angular-hammer.js` into your html file, after `angular.js` library.

```html
<script src="/path/to/angular.js"></script>
<script src="/path/to/angular-hammer.js"></script>
```

Next, load `hammer` module and that's all, you can use angular-hammer directives.

### Basic Example

```html
<div ng-controller="Main">
  <div class="box" hammer-tap="changeColor($event)">Tap</div>
</div>

<script>
  angular.module('myApp', ['hammer'])
    .controller('Main', ['$scope', function($scope) {
      $scope.changeColor = function changeColor(e) {
        console.log(e.currentTarget);
        e.currentTarget.classList.toggle('red');
      };
    }]);
</script>
```

### Passing options

Hammer.js has several [gesture options](https://github.com/EightMedia/hammer.js/wiki/Getting-Started#gesture-options). They can be passed in this way:

```html
<span class="test-item" hammer-tap="{ fn: 'changeColor($event)', hold_timeout: 1000 }"></span>
```

## License

MIT