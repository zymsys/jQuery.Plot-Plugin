(function ($) {
    $.fn.plot = function (options) {
        var context,
            settings = $.extend({
                //Graph with and height in pixels
                width: 200,
                height: 200,

                //Colour options
                gridColor: '#ccccff',
                axisColor: '#000000',

                //Function to plot y at x
                functions: [
                    {
                        f: function (x) { return x; },
                        plotColor: '#32cd32'
                    }
                ],

                //Position of centre in pixels
                offset: { x: 100, y: 100 },

                //Pixels per unit
                scale: 20,

                //Increment for function invocations
                granularity: 1

        }, options ? options : {});

        settings.extents = {
            left: -settings.offset.x,
            top: settings.height - settings.offset.y,
            right: settings.width - settings.offset.x,
            bottom: -settings.offset.y
        };
        settings.ratio = settings.granularity / settings.scale;

        function X(x) {
            return x + settings.offset.x;
        }

        function Y(y) {
            return settings.height - settings.offset.y - y;
        }

        function moveTo(x, y) {
            context.moveTo(X(x), Y(y));
        }

        function lineTo(x, y) {
            context.lineTo(X(x), Y(y));
        }

        function line(fromX, fromY, toX, toY) {
            context.beginPath();
            moveTo(fromX, fromY);
            lineTo(toX, toY);
            context.stroke();
        }

        function rotate(angle) {
            context.rotate(Math.PI*2/(angle*6));
        }

        function drawAxis() {
            context.strokeStyle = settings.axisColor;
            line(settings.extents.left, 0, settings.extents.right, 0);
            line(0, settings.extents.top, 0, settings.extents.bottom);
        }

        function drawGrid() {
            context.strokeStyle = settings.gridColor;
            var i = settings.extents.left - (settings.extents.left % settings.scale);
            while (i < settings.extents.right) {
                line(i, settings.extents.top, i, settings.extents.bottom);
                i += settings.scale;
            }
            i = settings.extents.bottom - (settings.extents.bottom % settings.scale);
            while (i < settings.extents.top) {
                line(settings.extents.left, i, settings.extents.right, i);
                i += settings.scale;
            }
        }

        function drawLabels() {
            var rotate90 = Math.PI / 2;
            if (settings.labelFont) context.font = settings.labelFont;
            if (settings.labels && settings.labels.y) {
                context.rotate(-rotate90);
                context.fillText(settings.labels.y,
                    settings.offset.y - settings.height + 5,
                    settings.offset.x - 5);
                context.rotate(rotate90);
            }
            if (settings.labels && settings.labels.x) {
                context.textBaseline = 'top';
                context.fillText(settings.labels.x, settings.offset.x + 5,
                    settings.height - settings.offset.y + 5)
                context.textBaseline = 'ideographic';
            }
        }

        function drawPlot(f) {
            var y,
                x = settings.extents.left,
                initialPoint = true;
            context.strokeStyle = f.plotColor;
            context.beginPath();
            while (x < settings.extents.right) {
                y = f.f(x * settings.ratio) / settings.ratio;
                if (initialPoint) {
                    moveTo(x,y);
                    initialPoint = false;
                } else {
                    lineTo(x,y);
                }
                x += settings.granularity;
            }
            context.stroke();
        }

        function mkEventFunction(f) {
            return function (e) {
                f.mousemove(
                    (e.offsetX - settings.offset.x) * settings.ratio,
                    (settings.height - e.offsetY - settings.offset.y) * settings.ratio,
                    f.f);
            };
        }

        function plot() {
            var me = $(this);
            if (settings.width) me.width(settings.width);
            if (settings.height) me.height(settings.height);
            var canvas = me[0].nodeName == 'CANVAS' ? me : $('<canvas>').width(me.width()).height(me.height());
            canvas.attr('width', me.width()).attr('height', me.height());
            context=canvas[0].getContext("2d");
            drawGrid();
            drawAxis();
            drawLabels();
            for (var i = 0, j = settings.functions.length; i < j; i += 1) {
                var f = settings.functions[i];
                drawPlot(f);
                if (f.mousemove) canvas.mousemove(mkEventFunction(f));
                if (f.click) canvas.click(mkEventFunction(f));
            }
            if (me !== canvas) me.append(canvas);
        }

        return this.each(function () {
            plot.call(this, settings);
        });
    };
})(jQuery);