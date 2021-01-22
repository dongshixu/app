/*
 * @Descripttion: 
 * @version: 
 * @Author: xds
 * @Date: 2021-01-09 09:57:59
 * @LastEditors: xds
 * @LastEditTime: 2021-01-09 10:09:22
 */

import * as d3 from 'd3';

const testBrush = function(dataRaw, id){
  dataRaw.then(data => {
    const columns = data.columns.filter(d => typeof data[0][d] === "number");
    const width = 954;
    const padding = 20;
    const size = (width - (columns.length + 1) * padding) / columns.length + padding;
  
    const x = columns.map(c => d3.scaleLinear()
                     .domain(d3.extent(data, d => d[c]))
                     .rangeRound([padding / 2, size - padding / 2]));
    
    const y = x.map(x => x.copy().range([size - padding / 2, padding / 2]));
  
    const z = d3.scaleOrdinal()
                .domain(data.map(d => d.species))
                .range(d3.schemeCategory10)
  
    const xAxis = function(g) {
      const axis = d3.axisBottom()
                     .ticks(6)
                     .tickSize(size * columns.length);
      return g.selectAll("g").data(x).join("g")
              .attr("transform", (d, i) => `translate(${i * size},0)`)
              .each(function(d) { return d3.select(this).call(axis.scale(d)); })
              .call(g => g.select(".domain").remove())
              .call(g => g.selectAll(".tick line").attr("stroke", "#ddd"));
    }
  
    const yAxis = function(g) {
      const axis = d3.axisLeft()
                     .ticks(6)
                     .tickSize(-size * columns.length);
      return g.selectAll("g").data(y).join("g")
              .attr("transform", (d, i) => `translate(0,${i * size})`)
              .each(function(d) { return d3.select(this).call(axis.scale(d)); })
              .call(g => g.select(".domain").remove())
              .call(g => g.selectAll(".tick line").attr("stroke", "#ddd"));
    }
  
    const brush = function(cell, circle, svg) {
      const brush = d3.brush()
          .extent([[padding / 2, padding / 2], [size - padding / 2, size - padding / 2]])
          .on("start", brushstarted)
          .on("brush", brushed)
          .on("end", brushended);
    
      cell.call(brush);
    
      let brushCell;
    
      // Clear the previously-active brush, if any.
      function brushstarted() {
        // console.log(brushCell)
        if (brushCell !== this) {
          d3.select(brushCell).call(brush.move, null);
          brushCell = this;
        }
      }
    
      // Highlight the selected circles.
      function brushed({selection}, [i, j]) {
        let selected = [];
        if (selection) {
          const [[x0, y0], [x1, y1]] = selection; 
          circle.classed("hidden",
            d => x0 > x[i](d[columns[i]])
              || x1 < x[i](d[columns[i]])
              || y0 > y[j](d[columns[j]])
              || y1 < y[j](d[columns[j]]));
          selected = data.filter(
            d => x0 < x[i](d[columns[i]])
              && x1 > x[i](d[columns[i]])
              && y0 < y[j](d[columns[j]])
              && y1 > y[j](d[columns[j]]));
        }
        svg.property("value", selected).dispatch("input");
      }
    
      // If the brush is empty, select all circles.
      function brushended({selection}) {
        if (selection) return;
        svg.property("value", []).dispatch("input");
        circle.classed("hidden", false);
      }
    }
  
  
    const selection = async function() {
      const svg = d3.create("svg")
          .attr("viewBox", [-padding, 0, width, width]);
    
      svg.append("style")
          .text(`circle.hidden { fill: #000; fill-opacity: 1; r: 1px; }`);
      
      svg.append("g")
          .call(xAxis);
    
      svg.append("g")
          .call(yAxis);
    
      const cell = svg.append("g")
      .attr('calss', 'cell')
                      .selectAll("g")
                      .data(d3.cross(d3.range(columns.length), d3.range(columns.length)))
                      .join("g")
                      .attr("transform", ([i, j]) => `translate(${i * size},${j * size})`);
      
      cell.append("rect")
          .attr("fill", "none")
          .attr("stroke", "#aaa")
          .attr("x", padding / 2 + 0.5)
          .attr("y", padding / 2 + 0.5)
          .attr("width", size - padding)
          .attr("height", size - padding);
    
      cell.each(function([i, j]) {
        d3.select(this).selectAll("circle")
          .data(data.filter(d => !isNaN(d[columns[i]]) && !isNaN(d[columns[j]])))
          .join("circle")
          .attr("cx", d => x[i](d[columns[i]]))
          .attr("cy", d => y[j](d[columns[j]]));
      });
    
      const circle = cell.selectAll("circle")
                         .attr("r", 3.5)
                         .attr("fill-opacity", 0.7)
                         .attr("fill", d => z(d.species));
    
      cell.call(brush, circle, svg);
    
      svg.append("g")
          .style("font", "bold 10px sans-serif")
          .style("pointer-events", "none")
          .selectAll("text")
          .data(columns)
          .join("text")
          .attr("transform", (d, i) => `translate(${i * size},${i * size})`)
          .attr("x", padding)
          .attr("y", padding)
          .attr("dy", ".71em")
          .text(d => d);
    
      svg.property("value", [])
      return svg.node();
    }
  
    // console.log(selection())
    selection().then(chart => document.getElementById(`${id}`).append(chart));
  
    // d3.select('#svg-test').append('svg')
    //                 .attr('height', 300)
    //                 .attr('width', 300)
    //                 .attr('style', 'border: 1px solid red')
    //                 .attr("viewBox", [0, 0, 40, 40])
    //                 .append('circle')
    //                 .attr('r', 20)
    //                 .attr('cx', 20)
    //                 .attr('cy', 20)
  
  })
}

export default {testBrush}
