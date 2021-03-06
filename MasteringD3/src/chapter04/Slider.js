function sliderControl() {

    var width = 600;
    var domain = [0, 100];

    //  기본 콜백 함수
    var onSlide = function (selection) {

    };

    function chart(selection) {
        selection.each(function (data) {

            // 컨테이너 그룹 셀렉션
            var group = d3.select(this);

            // 전체 너비와 같은 사이즈의 line 추가
            group.selectAll('line')
                .data([data])
                .enter()
                .append('line')
                .call(chart.initLine);

            var handle = group.selectAll('circle')
                .data([data])
                .enter()
                .append('circle')
                .call(chart.initHandle);

            // 위치 축척 설정
            var posScale = d3.scale.linear()
                .domain(domain)
                .range([0, width]);

            handle.attr('cx', function (d) {
                return posScale(d);
            });

            // 드래그 반응 생성 및 설정
            var drag = d3.behavior.drag().on('drag', moveHandle);

            // 핸들러에 드래그 반응 추가
            handle.call(drag);

            function moveHandle(d) {
                // 핸들러의 이동 후 위치 계산
                var cx = +d3.select(this).attr('cx') + d3.event.dx;

                // 핸들러가 유효한 범위 내에 있을 경우 위치 업데이트
                if ((0 < cx) && (cx < width)) {
                    // 새 선택값 계산 및 데이터 바인딩
                    d3.select(this).data([posScale.invert(cx)])
                        .attr('cx', cx)
                        .call(onSlide);
                }
            }

        });
    }

    chart.initLine = function (selection) {
        selection
            .attr('x1', 2)
            .attr('x2', width - 4)
            .attr('stroke', '#777')
            .attr('stroke-width', 4)
            .attr('stroke-linecap', 'round');
    };

    chart.initHandle = function (selection) {
        selection
            .attr('cx', function (d) {
                return width / 2;
            })
            .attr('r', 6)
            .attr('fill', '#aaa')
            .attr('stroke', '#222')
            .attr('stroke-width', 2);
    };

    chart.width = function (value) {
        if (!arguments.length) {
            return width;
        }
        width = value;
        return chart;
    };

    chart.domain = function (value) {
        if (!arguments.length) {
            return domain;
        }
        domain = value;
        return chart;
    };

    // 슬라이더 콜백 함수
    chart.onSlide = function (onSlideFunction) {
        if (!arguments.length) {
            return onSlide;
        }
        onSlide = onSlideFunction;
        return chart;
    };

    return chart;
}