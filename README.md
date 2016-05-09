FlipCounter (modified)
===========

Forked from https://github.com/waldobronchart/FlipCounter 
  - fixed some bugs and modified functionality a bit

## Usage

``` html
<div id="mycounter">1337</div>
```

``` js
$("#mycounter").flipCounterInit();

// To update the value and animate
$("#mycounter").flipCounterUpdate(9001);
```

## Config Options

- **speed** Float *(default:0.2)* - speed of animation
-	**onFlip** Function - Is called after each flip animation has completed
- **onResize** Function - Is called when digits are added or removed

## Requirements

- jQuery
- jsTween

## License (Microsoft Public License (MS-PL))
