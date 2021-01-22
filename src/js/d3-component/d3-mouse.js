/*
 * @Descripttion: 
 * @version: 
 * @Author: xds
 * @Date: 2021-01-10 09:46:14
 * @LastEditors: xds
 * @LastEditTime: 2021-01-16 16:05:04
 */
import * as d3 from 'd3';

// 鼠标移动事件
const mouseEvent = function(selector){
  const txt = d3.select(selector).append('text');
  const svg = d3.select(selector).attr('cursor', 'crosshair')
                                 .on('mousemove', function(e){
                                   const pt = d3.pointer(e); // v6版本从d3.mouse()进化到了d3.pointer(e)!!!注意
                                  //  console.log(pt)
                                  //  txt.attr('x', 18+pt[0]).attr('y', 6+pt[1])
                                  //     .text(` ${pt[0]},${pt[1]}`)
                                  txt.text(` ${pt[0]} | ${pt[1]}`)
                                     .attr('x', 10).attr('y', 20)
                                 });
}


// 鼠标交互事件
const makeBrush = function(dataRaw, id){
  const svgName = ['brush1', 'brush2'];
  dataRaw.then(data => {
    d3.select(`#${id}`).selectAll('.svgBrush').data(svgName).enter().append('svg')
                       .attr('width', 300)
                       .attr('height', 300)
                       .attr('id', d => d)
                       .attr('class', 'svgBrush')
                       .attr('style', function(d, i){
                          let temp = i===0? '0px':'10px' 
                          return `background: lightgrey; margin-left: ${temp}`
                       });
    const svg1 = d3.select('#brush1'),
          svg2 = d3.select('#brush2');
    const sc1 = d3.scaleLinear().domain([0, 10, 50]).range(['lime', 'yellow', 'red']),
          sc2 = d3.scaleLinear().domain([0, 10, 50]).range(['lime', 'yellow', 'blue']);
    
    const cs1 = _drawCircle(svg1, data, d=>d['A'], d=>d['B'], sc1);
    const cs2 = _drawCircle(svg2, data, d=>d['A'], d=>d['C'], sc2);

    svg1.call(_installHandlers, data, cs1, cs2, sc1, sc2);
    svg2.call(_installHandlers, data, cs2, cs1, sc2, sc1);

  })
}

function _drawCircle(svg, data, accX, accY, sc){
  const color = sc(Infinity);
  return svg.selectAll('circle').data(data).enter()
                                .append('circle')
                                .attr('r', 5).attr('cx', accX).attr('cy', accY)
                                .attr('fill', color).attr('fill-opacity', 0.4);
}

function _installHandlers(svg, data, cs1, cs2, sc1, sc2){
  const cursor = svg.append('circle').attr('r', 50)
                    .attr('fill', 'none').attr('stroke', 'black')
                    .attr('stroke-width', 10).attr('stroke-opacity', 0.1)
                    .attr('visibility', 'hidden');
  
  const hotzone = svg.append('rect').attr('cursor', 'none')
                    //  .attr('x', 50).attr('y', 50)
                     .attr('width', 300).attr('height', 300)
                     .attr('visibility', 'hidden')
                     .attr('pointer-events', 'all')  // pointer-event 很重要对于事件穿透！！！

                     .on('mouseenter', function(){
                       cursor.attr('visibility', 'visible')
                     })
                     .on('mousemove', function(e){
                       const pt = d3.pointer(e);
                       cursor.attr('cx', pt[0]).attr('cy', pt[1]);

                       cs1.attr('fill', function(d, i){
                         let dx = pt[0] - d3.select(this).attr('cx'),
                             dy = pt[1] - d3.select(this).attr('cy'),
                             r = Math.hypot(dx, dy);

                         data[i]['r'] = r;
                         return sc1(r);
                       });

                       cs2.attr('fill', (d, i) => sc2(data[i]['r']));
                     })
                     .on('mouseleave', function(){
                       cursor.attr('visibility', 'hidden');
                       cs1.attr('fill', sc1(Infinity));
                       cs2.attr('fill', sc2(Infinity));
                     })
}


const makeDragDrop = function(id){
  let ds1 = [[100, 100, 'red'], [300, 100, 'yellow'], [500, 100, 'green']];
  let ds2 = [[50, 50, 'red'], [150, 150, 'yellow'], [250, 250, 'green']];

  let widget = undefined, color = undefined;

  const drag = d3.drag()
                 .on('start', function(){
                   color = d3.select(this).attr('fill'); // 记住拖拽组件的颜色
                  //  console.log(color)
                   widget = d3.select(this).attr('fill', 'lime')
                 })
                 .on('drag', function(e){
                   const pt = d3.pointer(e);
                  //  console.log(pt)
                   widget.attr('cx', pt[0]).attr('cy', pt[1]);
                 })
                 .on('end', function(){
                   widget.attr('fill', color);
                   widget = undefined;
                 })

  // draw circles
  const svg = d3.select(`#${id}`);
  const circles = svg.selectAll('circle').data(ds1).enter()
                    .append('circle')
                    .attr('cx', d => d[0])
                    .attr('cy', d => d[1])
                    .attr('r', 20)
                    .attr('fill', d => d[2])
                    .call(drag);
  
  svg.on('click', function(){
    [ds1, ds2] = [ds2, ds1];

    svg.selectAll('circle').data(ds2)
       .transition().duration(1000).delay((d, i) => 200*i)
       .attr('cx', d => d[0]).attr('cy', d => d[1])
  })

  svg.append('rect')  // 补间动画矩形旋转360
     .attr('x', 620).attr('y', 80)
     .attr('fill', 'yellow')
     .attr('width', 40).attr('height', 40)
     .transition().duration(2000).ease(t => t)
     .attrTween('transform', function(){
       return t => `rotate(${360*t}, 640, 100)` // rotate(angle, x, y)  x，y => 围绕旋转的中心
     })
}

const makeLissajous = function(id){
  const svg = d3.select(`#${id}`);

  const a = 3.2, b = 5.9;  // Lissajours frequencies
  let phi, omega = 2*Math.PI/10000  // 10 seconds per period

  let crrX = 300+100, crrY = 300+0;
  let prvX = crrX, prvY = crrY;

  const timer = d3.timer(function(t){
    phi = omega*t;
    
    crrX = 300 + 100*Math.cos(a*phi);
    crrY = 300 + 100*Math.sin(b*phi);

    svg.selectAll('line')
       .each(function(){
         this.bogus_opacity *= .99
        //  let opacity = d3.select(this).attr('stroke-opacity')
        //  console.log(opacity, this.bogus_opacity)
          // d3.select(this).attr('opacity')
       })
       .attr('stroke-opacity', function(){
         return this.bogus_opacity
       })
       .filter(function(){
         return this.bogus_opacity < 0.01
       })
       .remove();
    
    svg.append("line")
       .each(function(){
         this.bogus_opacity = 1.0
       })
       .attr('x1', prvX).attr('y1', prvY)
       .attr('x2', crrX).attr('y2', crrY)
       .attr('stroke', 'red').attr('stroke-width', 2)

       prvX = crrX;
       prvY = crrY;

    if(t > 120e3) timer.stop() // after 120 seconds
  })
}

const makeVoters = function(id){
  const svg = d3.select(`#${id}`);
  const n = 50, w = 300/n, dt = 3000, padding = {top: 200, left: 200, rigth: 200, bottom: 200};
  
  const data = d3.range(n*n)
                 .map(d => {return {
                   x: d%n,
                   y: d/n|0,  // 'x|0'表示左边的值取整的一种简单的写法
                   val: Math.random(),
                 }})
  
  // console.log(data)

  const sc = d3.scaleQuantize()
               .range(['white', 'red', 'black'])

  svg.selectAll('rect').data(data).enter().append('rect')
     .attr('x', d=>w*d.x+padding.left).attr('y', d=>w*d.y+padding.top)
     .attr('width', w-1).attr('height', w-1)
     .attr('fill', d=>sc(d.val))

  function update(){
    const nbs = [
      [0, 1], [0, -1], [1, 0], [-1, 0],
      [1, 1], [1, -1], [-1, 1], [-1, -1],
    ]

    return d3.shuffle(d3.range(n*n)).map(i => {
      let nb = nbs[nbs.length*Math.random() | 0];
      let x = (data[i].x + nb[0] + n)%n;
      let y = (data[i].y + nb[1] + n)%n;
      data[i].val = data[y*n+x].val;
    })
  }

  d3.interval(function(){
    update();
    svg.selectAll('rect').data(data)
                         .transition().duration(dt).delay((d, i) => i*0.25*dt/(n*n) )
                         .attr('fill', d => sc(d.val))
  }, dt)

}

export default{mouseEvent, makeBrush, makeDragDrop,  makeLissajous, makeVoters}