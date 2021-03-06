/*
 * @Descripttion: 
 * @version: 
 * @Author: xds
 * @Date: 2021-01-17 14:45:03
 * @LastEditors: xds
 * @LastEditTime: 2021-01-17 16:59:09
 */
// d3 蜡烛图
import * as d3 from 'd3';

const candleStick = function(id, dataRaw){
  // const svg = d3.select(`#${id}`).append('svg').attr('viewbox', [0, 0, width, width])
  let data = [];
  const parseDate = d3.timeFormat("%Y-%m-%d");
  const dateRange = [];

  dataRaw.then(d => {
    let d1 = d.slice(-120);
    d1.map(res => {
        const date = `${parseDate(res['Date'])}`;
        dateRange.push(date)
        data.push({
          date: date,
          high: +res["High"],
          low: +res["Low"],
          open: +res["Open"],
          close: +res["Close"]
        })
    });
    
    const margin = {top: 20, right: 20, bottom: 20, left: 50};
    const width = 954, height = 600;

    const lastDay = new Date(data[data.length - 1].date)
    const plusOneDay = new Date(`${lastDay.getFullYear()}-${lastDay.getMonth()+1}-${lastDay.getDate()+1}`)

    const scX = d3.scaleBand()
                  // .domain(dateRange)
                  .domain(
                    d3.utcDay
                      .range(new Date(data[0].date), plusOneDay)
                      .filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)  // 获取从第一天到最后一天时间 interval 去除周末
                  )
                  .range([margin.left, width - margin.right])
                  .padding(0.2);

    const scY = d3.scaleLog()
                  .domain([d3.min(data, d=>d.low), d3.max(data, d=>d.high)])
                  .rangeRound([height-margin.bottom, margin.top])

    const xAxis = g => {
      g.attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(scX)
              .tickValues(d3.utcMonday
                .every(width>720? 1:2)
                .range(new Date(data[0].date), new Date(data[data.length-1].date)) // 横坐标只显示星期一日期
              )
              .tickFormat(d3.utcFormat("%-m/%-d"))
            )
      .call(g => g.select('.domain').remove())
    }

    // console.log(d3.utcMonday.range(new Date(data[0].date), new Date(data[data.length-1].date)).map(d => parseDate(d)))
    // const temp = d3.Format('%m-%d')
    // console.log(temp("2017-11-20"))

    const yAxis = g => {
      g.attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(scY)
        .tickFormat(d3.format('$~f'))
        .tickValues(d3.scaleLinear().domain(scY.domain()).ticks()))
        .call(g => g.selectAll('.tick line').clone()
                    .attr('stroke-opacity', 0.2)
                    .attr('x2', width - margin.left -margin.right))
        .call(g => g.selectAll('.domain').remove())
    } 

    const formatDate = d3.timeFormat("%B %-d, %Y");
    const formatValue = d3.format('.2f');

    const formatChange = (y0, y1) => {
      const f = d3.format("+.2%");
      return f((y1 - y0) / y0);
    }

    const chart = async function(){
      const svg = d3.create('svg')
                    .attr('viewbox', `0,0,100,60`) // 
                    .attr('width', width)
                    .attr('height', height);

      svg.append('g').call(xAxis).attr('class', 'xAxis');
      svg.append('g').call(yAxis).attr('class', 'yAxis');

      const g = svg.append("g")
                  // .attr("stroke-linecap", "round")
                  .attr("stroke", "black")
                  .selectAll("g")
                  .data(data)
                  .join("g")
                  .attr("transform", d => `translate(${scX(new Date(d.date))}, 0)`);
      g.append("line")
      .attr("y1", d => scY(d.low))
      .attr("y2", d => scY(d.high));
            
      g.append("line")
          .attr("y1", d => scY(d.open))
          .attr("y2", d => scY(d.close))
          .attr("stroke-width", scX.bandwidth())
          .attr("stroke", d => d.open > d.close ? d3.schemeSet1[0]
              : d.close > d.open ? d3.schemeSet1[2]
              : d3.schemeSet1[8]);

      g.append("title")
          .text(d =>
             `${formatDate(new Date(d.date))}
                Open: ${formatValue(d.open)}
                Close: ${formatValue(d.close)} (${formatChange(d.open, d.close)})
                Low: ${formatValue(d.low)}
                High: ${formatValue(d.high)}`);

      return svg.node();
    }

  chart().then(ct => document.getElementById(`${id}`).append(ct));

  })
  
}

export default{candleStick}