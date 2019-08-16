import React from 'react';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
} from 'bizcharts';
import DataSet from "@antv/data-set";
import moment from 'moment';

class Basic extends React.Component {
  render() {
    const { height ,title,type,data,changeDay} = this.props;
    if(!data.length) return false;
      for(let i=0;i<data.length;i++){
        if(data[i].inTime){
          let inTime=data[i].inTime;
          (String(inTime).indexOf(":") != -1)&&(data[i].inTime=moment(changeDay+' '+inTime).valueOf());
          data[i].pac=Number(data[i].pac);
        }
      }
    const cols = {
      inTime: {
      type: 'time',
      tickInterval: 60 * 60 * 1000,
      mask: 'HH:mm',
      range: [0, 1],
      },
      pac: {
        alias: ' ',// 为属性定义别名
        formatter:(value)=>value+'kW',
      },
    };
    return (
      <div style={{height}} >
        {title && <h4 style={{ marginBottom: 20 }}>{title}</h4>}
        <Chart 
        height={title ? height - 41 : height}
        data={data} //判断群组还是单机
        scale={cols} 
        forceFit={true}
        padding='auto'
        >
          <Axis name="inTime"  />
          <Axis name="pac"   />
          <Legend position="right-top" title={null} dx={20} />
          <Tooltip crosshairs={{ type: "line" }} />
          <Geom type="point" position="inTime*pac" size={2} color={type==='total'? '':'GoodsID'}  shape="circle" />
          <Geom type="line" position="inTime*pac" size={2} color={type==='total'? '':'GoodsID'} shape="smooth" />
        </Chart>
      </div>
    );
  }
}

export default Basic;
