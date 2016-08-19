function bubbleChart() {
    var width = 700, height = 500;

    var radiusExtent = [10, 50];

    var cScale = d3.scale.category10();

    var name = function (d) {
        return d.name;
    };

    var usage = function (d) {
        return d.usage;
    };

    var charge = function (d) {
        return -0.12 * d.r * d.r;
    };

    function chart(selection) {
        selection.each(function (data) {

            // 컨테이너 div 셀렉션 생성 및 속성 설정
            var containerDiv = d3.select(this);

            // 내림차순으로 정렬
            data.
                sort(function (a, b) {
                    return usage(a) - usage(b);
                });

            var nameList = data.map(name),
                names = d3.set(nameList).values();

            cScale.domain(names);

            // 반지름 축척 생성
            var rScale = d3.scale.sqrt()
                .domain(d3.extent(data, usage))
                .range(radiusExtent);

            // 반지름을 한 번만 계산해서 재사용하도록 데이터 아이템인 d의 속성으로 추가
            data.forEach(function (d) {
                d.r = rScale(usage(d));
            });

            // 포스 레이아웃 설정
            var force = d3.layout.force()
                .nodes(data)
                .links([])
                .charge(charge)
                .size([width, height])
                .start();

            // 컨테이너 div 셀렉션 생성 및 속성 설정
            containerDiv
                .style('position', 'relative')
                .style('width', width + 'px')
                .style('height', height + 'px')
                .style('padding', 0)
                .style('background-color', '#eeeeec');

            // 버블을 나타내는 div를 생성하고 데이터 바인딩하고 속성값 설정
            var bubbleDivs = containerDiv.selectAll('div.bubble')
                .data(data)
                .enter()
                .append('div')
                .attr('class', 'bubble')
                .style('position', 'absolute')
                .style('width', function (d) {
                    return 2 * d.r + 'px';
                })
                .style('height', function (d) {
                    return 2 * d.r + 'px';
                })
                .style('border-radius', function (d) {
                    return d.r + 'px';
                })
                .style('background-color', function (d) {
                    return cScale(name(d));
                });


            force.on('tick', function () {
                bubbleDivs
                    .style('top', function (d) {
                        return (d.y - d.r) + 'px';
                    })
                    .style('left', function (d) {
                        return (d.x - d.r) + 'px';
                    });
            });
        });
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

    chart.radiusExtent = function (value) {
        if (!arguments.length) {
            return radiusExtent;
        }
        radiusExtent = value;
        return chart;
    };

    chart.colorScale = function (colorScale) {
        if (!arguments.length) {
            return cScale;
        }
        cScale = colorScale;
        return chart;
    };

    chart.name = function (nameAccessor) {
        if (!arguments.length) {
            return name;
        }
        name = nameAccessor;
        return chart;
    };

    chart.usage = function (usageAccessor) {
        if (!arguments.length) {
            return usage;
        }
        usage = usageAccessor;
        return chart;
    };

    chart.charge = function (chargeMethod) {
        if (!arguments.length) {
            return charge;
        }
        charge = chargeMethod;
        return chart;
    };

    return chart;
}
