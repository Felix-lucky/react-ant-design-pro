import React from "react";
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
  Util
} from "bizcharts";
import moment from 'moment';

class Basiccolumn extends React.Component {
  render() {
    const { height ,title,type,statusType,data,changeMonth} = this.props;
    const baseData=[];
    const datas=[];
    const xDatas=[];
    const dataObj=[];
    const list={};
    const dataGoods=[];
    if(!data.length) return false;
    //组装数据
      for( let i = 0 ; i< ( statusType==='month' ? moment(changeMonth).daysInMonth() : 12 ) ; i++ ){
        let index=(i+1).toString();
          xDatas[i]=index;
          if(type==='total'){
            baseData[i]={id:index, pac:0,};
            let obj;
            data.length>i&&(obj={ id:index,pac:Number(data[i].pac)});
          datas[i]=Object.assign(baseData[i], obj);
        }else{
          for(let j=0;j<data.length;j++){
            let obj={};
            let newObj={};
            let itemData=data[j].data;
            for(let key in itemData){
              let k=(parseInt(key)+1).toString();
              newObj[k]=Number(itemData[key].pac);
            }
            obj={
              GoodsID:data[j].GoodsID,
              ...newObj,
            }
            dataObj[j]=obj;
          }
        }
      }
      const ds = new DataSet();
      const dv = ds.createView().source(dataObj);
      dv.transform({
        type: "fold",
        fields: xDatas,
        // 展开字段集
        key: "id",
        // key字段
        value: "pac" // value字段
      });
      const cols = {
        pac: {
          type:"linear",
          min:0,
          alias: ' ',// 为属性定义别名
          formatter:(value)=>value+'kWh',
        },
      };
    return (
      <div  style={{height}} >
          {title && <h4 style={{ marginBottom: 20 }}>{title}</h4>}
        <Chart 
            height={title ? height - 41 : height}
            data={type==='total'?datas:dv} 
            forceFit={true}
            scale={cols} 
            padding='auto'
            >
          <Legend   position="right-top"  title={null} dx={20} />
          <Axis name='id' />
          <Axis name="pac" />
          <Tooltip />
          <Geom type="intervalStack" color={type==='total'?'':"GoodsID"} position="id*pac" />
        </Chart>
      </div>
    );
  }
}

export default Basiccolumn;