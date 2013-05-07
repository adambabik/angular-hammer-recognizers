# angular-hammer

[Hammer.js](http://eightmedia.github.io/hammer.js/) adapter for [AngularJS](http://angularjs.org/).

## How To Use

angular-hammer defines a single directive for each gesture. For instance, for `tap` gesture, it defines `hammer-tap` directive. [Here](https://github.com/EightMedia/hammer.js/wiki/Getting-Started#gesture-events) you can find all hammer.js gestures.

### Example

```html
<span class="test-item" hammer-tap="changeColor($event)"></span>

<script>
	angular.module('app', []).controller('Main', function Main($scope) {
		$scope.changeColor = function changeColor(e) {
			console.log(e.currentTarget);
			angular.element(e.currentTarget).addClass('red');
		}
	});
</script>
```
