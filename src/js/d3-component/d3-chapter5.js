/*
 * @Descripttion: 
 * @version: 
 * @Author: xds
 * @Date: 2021-01-16 16:29:57
 * @LastEditors: xds
 * @LastEditTime: 2021-01-17 14:41:48
 */
// 包括：生成器，组件，布局，绘制曲线和形状

import * as d3 from 'd3'

const makeSymbols = function(id){
  const svg = d3.select(`#${id}`);
  const g = svg.append('g');

  const data = [
    {'x': 40, 'y': 0, 'val': 'A'},
    {'x': 80, 'y': 30, 'val': 'A'},
    {'x': 120, 'y': -10, 'val': 'A'},
    {'x': 160, 'y': 15, 'val': 'A'},
  ];

  const arrow = function(){
    return 'M0 0 L16 0 M8 4 L16 0 L8 -4'
  }

  const sc = d3.scaleLinear().domain([-10, 30]).range([80, 40])

  g.selectAll('path').data(data).enter().append('path')
   .attr('d', arrow)
   .attr('transform', d => `translate(${d['x']}, ${sc(d['y'])})`)
}

const makeCrosshair = function(id){
  const line = [
    [-3, 0, -1, 0],
    [1, 0, 3, 0],
    [0, -1, 0, -3],
    [0, 1, 0, 3],
  ]

  const svg = d3.select(`#${id}`).append('svg')
                                 .attr('width', 600)
                                 .attr('height', 100)
                                 .attr('id', 'svg-symbol')
                                 .attr('style', 'background: lightgrey')
  const defs = svg.append('defs')
  const g = defs.append('g').attr('id', 'crosshair')
  const circle = g.append('circle').attr('cx', 0).attr('cy', 0).attr('r', 2).attr('fill', 'none')

  const lines = g.selectAll('line').data(line).enter()
                                  .append('line')
                                  .attr('x1', d=>d[0]).attr('y1', d=>d[1])
                                  .attr('x2', d=>d[2]).attr('y2', d=>d[3])
  
  
  const data = [
    [180, 1],
    [260, 3],
    [340, 2],
    [420, 4],
  ];

  const crosshairs = d3.select('#svg-symbol').selectAll('use').data(data).enter()
                                                              .append('use') //使用use复用defs
                                                              .attr('href', '#crosshair')
                                                              .attr('transform', d => `translate(${d[0]}, 50) scale(${2*d[1]})`)
                                                              .attr('stroke', 'black')
                                                              .attr('stroke-width', d => 0.5/Math.sqrt(d[1]))


}

//component

const makeTransformaion = function(id){

  const sticker = function ( sel, label ) {                                  //<1>
            sel.append( "rect" ).attr( "rx", 5 ).attr( "ry", 5 )          //<2>
                .attr( "width", 70 ).attr( "height", 30 )
                .attr( "x", -35 ).attr( "y", -15 )
                .attr( "fill", "none" ).attr( "stroke", "blue" )
                .classed( "frame", true );                                //<3>
                
            sel.append( "text" ).attr( "x", 0 ).attr( "y", 5 )            //<4>
                .attr( "text-anchor", "middle" )
                .attr( "font-family", "sans-serif" ).attr( "font-size", 14 )
                .classed( "label", true )
                .text( label ? label : d => d );                          //<5>
        }

  const svg = d3.select(`#${id}`).append('svg').attr('width', 600).attr('height', 200).attr('style', 'background: lightgrey');

  const trsf1 = function(sel, dx, dy){
    return sel.attr('transform', `translate(${dx}, ${dy})`)
  };
  
  const trsf2 = function(sel, dx, dy){
    sel.each(function(d, i){
      this.bogus_dx = typeof dx === 'function'? dx(d, i):dx||0
    });
    sel.each(function(d, i){
      this.bogus_dy = typeof dy === 'function'? dy(d, i):dy||0
    });

    return sel.attr('transform', function(){
      return `translate(${this.bogus_dx}, ${this_bogus_dy})`
    })
  }

  const trsf3 = function(sel, dx, dy){  // 现在只加入了平移，可以同理加入旋转，缩放
    const dxs = d3.local(), dys = d3.local(); // 定义了局部的变量d3.local()
    sel.each(function(d, i){
      // console.log(typeof dx)
      dxs.set(this, typeof dx === 'function'? dx(d, i):dx||0)  // 设置局部变量set()
    });
    sel.each(function(d, i){
      dys.set(this, typeof dy === 'function'? dy(d, i):dy||0)
    })

    return sel.attr('transform', function(){
        return `translate(${dxs.get(this)}, ${dys.get(this)})` // 获取局部变量get()
    })
    
  }

  const scX = d3.scaleLinear().domain([0, 5]).range([100, 500]);
  const scy = d3.scaleLinear().domain([0, 5]).range([50, 150]);

  const ds = ['This', 'That'];
  const i = 1;



  svg.append('g').selectAll('g').data(ds).enter().append('g')
  .call(trsf3, (d, i)=>300+scX(i), (d, y)=> scy(i)).call(sticker)
  
}

export default{ makeSymbols, makeCrosshair, makeTransformaion }