/*
 * @Descripttion: 
 * @version: 
 * @Author: xds
 * @Date: 2021-01-09 10:40:13
 * @LastEditors: xds
 * @LastEditTime: 2021-01-09 11:13:09
 */
import * as d3 from 'd3';

const testUpdate = function(id){
  let ds1 = [
    [2, 3, 'green'],
    [1, 2, 'red'],
    [2, 1, 'blue'],
    [3, 2, 'yellow'],
  ];
  let ds2 = [
    [1, 1, 'red'],
    [3, 3, 'black'],
    [1, 3, 'lime'],
    [3, 1, 'blue'],
  ];

  const width = 500,
        height = 500;

  const scX = d3.scaleLinear().domain([1, 3]).range([100, 200]),
        scY = d3.scaleLinear().domain([1, 3]).range([50, 100]);

  const svg = d3.select(`#${id}`).append('svg').attr('width', width).attr('height', height);

  svg.on('click', function(){
    [ds1, ds2] = [ds2, ds1];
    let cs = svg.selectAll('circle').data(ds1, d=>d[2]);

    cs.exit().remove();
    cs = cs.enter().append('circle')
                   .attr('r', 5).attr('fill', d=>d[2])
                   .merge(cs);
    
    cs.attr('cx', d=>scX(d[0])).attr('cy', d=>scY(d[1]));

    // svg.dispatch('click'); //生成一个合成点击事件，并在首次加载的时候填充界面（我的理解是第一次加载时调用点击事件）
  })
}

export default{testUpdate}