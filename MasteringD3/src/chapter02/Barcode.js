var barcodeChart = function () {
    var width = 600, height = 30;
    var margin = {
        top: 0,
        right: 10,
        bottom: 0,
        left: 10
    };

    var value = function (d) {
        return d.date;
    };

    var timeInterval = d3.time.day;

    function chart(selection) {
        selection.each(function (data) {
            var div = d3.select(this).attr('class', 'data-item'),
                svg = div.selectAll('svg').data([data]);

            svg
                .enter()
                .append('svg')
                .call(svgInit);

            var g = svg.select('g.chart-content'),
                lines = g.selectAll('line');


//                var lastDate = d3.max(data, value),
            var lastDate = d3.max(data, value);
            lastDate = lines.empty() ? lastDate : d3.max(lines.data(), value);
            var firstDate = timeInterval.offset(lastDate, -1);

            var xScale = d3.time.scale()
                .domain([firstDate, lastDate])
                .range([0, width - margin.left - margin.right]);


            var bars = g.selectAll('line')
                .data(data, value);

            bars.enter().append('line')
                .attr('x1', function (d) {
                    return xScale(value(d));
                })
                .attr('x2', function (d) {
                    return xScale(value(d));
                })
                .attr('y1', 0)
                .attr('y2', height - margin.top - margin.bottom)
                .attr('stroke', '#000')
                .attr('stroke-opacity', 0.5);

            // 새 데이터셋으로 축척 업데이트
            lastDate = d3.max(data, value)
            firstDate = timeInterval.offset(lastDate, -1)
            xScale.domain([firstDate, lastDate]);

            bars.transition()
                .duration(300)
                .attr('x1', function (d) {
                    return xScale(value(d));
                })
                .attr('x2', function (d) {
                    return xScale(value(d));
                });

            // 데이터 아이템과 연결되지 않은 막대 제거
            bars.exit().transition()
                .duration(300)
                .attr('stroke-opacity', 0)
                .remove();
        });
    }

    function svgInit(svg) {
        svg
            .attr('width', width)
            .attr('height', height);

        var g = svg.append('g')
            .attr('class', 'chart-content')
            .attr('transform', 'translate(' + [margin.left, margin.top] + ')');


        g.append('rect')
            .attr('width', width - margin.left - margin.right)
            .attr('height', height - margin.top - margin.bottom)
            .attr('fill', 'white');

    }

    chart.width = function (value) {
        if (!arguments.length) {
            return width;
        }
        width = value;
        return chart;
    };

    chart.height = function (value) {
        if (!arguments.length) {
            return height;
        }
        height = value;
        return chart;
    };

    chart.margin = function (value) {
        if (!arguments.length) {
            return margin;
        }
        margin = value;
        return chart;
    };

    chart.value = function (accessorFunction) {
        if (!arguments.length) {
            return value;
        }
        value = accessorFunction;
        return chart;
    };

    chart.timeInterval = function (value) {
        if (!arguments.length) {
            return timeInterval;
        }
        timeInterval = value;
        return chart;
    };

    return chart;
};

function randomInterval(avgSeconds) {
    return Math.floor(-Math.log(Math.random()) * 1000 * avgSeconds);
}

function addData(data, numItems, avgSeconds) {
    var n = data.length,
        t = (n > 0) ? data[n - 1].date : new Date();

    for (var k = 0; k < numItems - 1; k += 1) {
        t = new Date(t.getTime() + randomInterval(avgSeconds));
        data.push({date: t});
    }

    return data;
}