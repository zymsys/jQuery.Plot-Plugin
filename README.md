#jQuery.Plot Plugin#

Before getting too deep into this one, make sure that you've looked into [flot][http://code.google.com/p/flot/].  I
looked for 10 or 15 minutes before writing this and couldn't find anything that suited my needs.  Then after I'd
written it I discovered flot, which is probably an all around better solution for your plotting needs.

##Basic Usage##
jQuery.Plot is implemented as a jQuery plugin, so it is very easy to use.  Just include jQuery on your page, then include
jquery.plot.js, and call .plot() on the selector of your choosing.  For example, here's the simplest use case (also found
in examples/simple.html):

```html
<!DOCTYPE HTML>
<html>
<head>
    <title>Simplest Possible Example</title>
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
    <script type="text/javascript" src="../jquery.plot.js"></script>
</head>
<body>
<h1>Simplest Possible Plot Example</h1>
<p>In this example we just attach plot to a container DIV with no other options.  The default behaviour draws
a simple y = x plot.</p>
<div id="container"></div>
</body>
<script type="text/javascript">
$(function () {
    $('#container').plot();
});
</script>
</html>
```

###Formatting your Plot###
You can pass options to plot() through an object literal.  The formatting options are:

**width**: Width in pixels to make the plot

**height**: Height in pixels to make the plot

**gridColor**: Color of the background grid lines

**axisColor**: Color of the center axis / cross-hairs

**offset**: Object literal with x and y values for the offset of the center of the plot, in pixles, from the bottom 
left corner.

**scale**: Pixels per unit - used as the size of the grid too

**granularity**: How many pixels between function calls to plot y from x.  Increase this number for better performance.