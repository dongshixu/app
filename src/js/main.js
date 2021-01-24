/*
 * @Descripttion: 
 * @version: 
 * @Author: xds
 * @Date: 2020-12-15 21:17:01
 * @LastEditors: xds
 * @LastEditTime: 2021-01-17 16:28:57
 */
require('../style/main.css');
import ts from './d3-component/d3-selection';
import tu from './d3-component/d3-update';
import tm from './d3-component/d3-mouse';
import tc from './d3-component/d3-chapter5'
import tec from './example/canadleStiick'

import * as d3 from 'd3';

//创建一个原始的svg（画布）
// const svg = d3.select('#svg-test').append('svg').attr('width', 1000).attr('height', 700).attr('id', 'gg').style('background', 'lightgrey');

// // 获取数据
// const dataRaw = d3.csv('./file/penguins.csv', d3.autoType)
// // 画图
// ts.testBrush(dataRaw, 'svg-test')

//数据更新测试（include enter, exit and update）
// tu.testUpdate('svg-test')

//鼠标移动事件
// tm.mouseEvent('#gg')

//鼠标交互刷子
// const dataRaw = d3.csv('./file/dense.csv', d3.autoType)
// tm.makeBrush(dataRaw, 'svg-test')

//鼠标拖拽事件
// tm.makeDragDrop('gg')


// 时时动画利萨茹曲线，投票图
// tm.makeLissajous('gg')
// tm.makeVoters('gg')

// 符号
// tc.makeSymbols('gg')
// tc.makeCrosshair('svg-test')
// tc.makeTransformaion('svg-test')

//蜡烛图
// 获取数据
const dataRaw = d3.csv('./file/aapl-2.csv', d3.autoType)
tec.candleStick('svg-test', dataRaw)




