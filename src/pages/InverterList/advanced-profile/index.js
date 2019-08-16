import React, { Component, Fragment } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import {
  Button,
  Menu,
  Dropdown,
  Icon,
  Row,
  Col,
  Steps,
  Card,
  Popover,
  Badge,
  Table,
  Tooltip,
  Divider,
} from 'antd';
import classNames from 'classnames';
import { DescriptionList } from 'ant-design-pro';
import moment from 'moment';
import { FormattedMessage, formatMessage } from 'umi/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SalesCard from './SalesCard';
import Specificationo from './Specification';
import NumberInfo from 'ant-design-pro/lib/NumberInfo';
import { numberUnit } from '@/utils/utils';

import styles from './style.less';
import numeral from 'numeral';
const { Step } = Steps;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;
const contentbox = null;
const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;
const goodsId=localStorage.getItem('goodsId');

const tabList = [
  {
    key: 'line',
    tab: formatMessage({ id: 'app.inverter.chart' }),
  },
  // {
  //   key: 'info',
  //   tab: formatMessage({ id: 'app.inverter.message-information' }),
  // },
  {
    key: 'detail',
    tab: formatMessage({ id: 'app.inverter.parameter' }),
  },
  {
    key: 'Log',
    tab: formatMessage({ id: 'app.inverter.logs' }),
  },
];


@connect(({ inverterfile, loading ,inverterChart,global}) => ({
  MemberAutoID:global.MemberAutoID,
  inverterfile,
  inverterChart,
  loading: loading.effects['inverterfile/fetch'],
  loading: loading.effects['inverterfile/fetchLogs'],
  loading: loading.effects['inverterfile/fetchParameter'],
  loading: loading.effects['inverterChart/fetchDay'],
}))
class Inverterfile extends Component {
  state = {
    operationkey: 'tab1',
    OperationInfoKey: 'line',
    stepDirection: 'horizontal',
    salesType: 'all',
    currentTabKey: '',
    statusType:'today',
    changeMonth:'',
    changeDay:moment().format('YYYY-MM-DD'),
    screenHeight:350,
    moreStatus:false,
  };

  LogColumns = [
    // {
    //   title: formatMessage({ id: 'app.inverter.parameter.S/N' }),
    //   dataIndex: 'no',
    //   key: 'no',
    // },
    {
      title: formatMessage({ id: 'app.inverter.parameter.name' }),
      dataIndex: 'GoodsID',
      key: 'GoodsID',
    },
    {
      title: formatMessage({ id: 'app.inverter.parameter.time' }),
      dataIndex: 'Time',
      key: 'Time',
    },
    {
      title: formatMessage({ id: 'app.inverter.parameter.handle' }),
      dataIndex: 'ErrorCode',
      key: 'ErrorCode',
      render: (text, row, index) => {
        return formatMessage({ id: `app.logs.msg${text}` });
      }
    },
  ];
  /**
   *日发电量
   *
   * @memberof AdvancedProfile
   */
  getDay=(dispatch,GoodsID,value)=>{
    dispatch({
      type: 'inverterChart/fetchDay',
      payload:{
        GoodsID:GoodsID,
        date:moment(value).format('YYYY-MM-DD'),
      },
    });
  }

  /**
   *月发电量
   *
   * @memberof AdvancedProfile
   */
  getMonth=(dispatch,GoodsID,value)=>{
    dispatch({
      type: 'inverterChart/fetchMonth',
      payload:{
        GoodsID:GoodsID,
        date:moment(value).format('YYYY-MM'),
      },
    });
  }

  /**
   *年发电量
   *
   * @memberof AdvancedProfile
   */
  getYear=(dispatch,GoodsID,value)=>{
    dispatch({
      type: 'inverterChart/fetchYear',
      payload:{
        GoodsID:GoodsID,
        date:moment(value).format('YYYY'),
      },
    });
  }
  /**
   *获取详细信息
   *
   * @memberof Inverterfile
   */
  getResult=(dispatch,MemberAutoID,GoodsID)=>{
    dispatch({
      type: 'inverterfile/fetch',
      payload:{
        MemberAutoID:MemberAutoID,
        GoodsID:GoodsID,
      },
    });
  }

/**
   *获取资讯
   *
   * @memberof Inverterfile
   */
  getDetails=(dispatch,MemberAutoID,GoodsID)=>{
    dispatch({
      type: 'inverterfile/fetchDetail',
      payload:{
        MemberAutoID:MemberAutoID,
        GoodsID:GoodsID,
      },
    });
  }
  /**
   *获取详细参数
   *
   * @memberof Inverterfile
   */
  getParameters=(dispatch,MemberAutoID,GoodsID)=>{
    dispatch({
      type: 'inverterfile/fetchParameter',
      payload:{
        MemberAutoID:MemberAutoID,
        GoodsID:GoodsID,
      },
    });
  }
  /**
   *获取历史信息
   *
   * @memberof Inverterfile
   */
  getLogs=(dispatch,GoodsID)=>{
    dispatch({
      type: 'inverterfile/fetchLogs',
      payload:{
        MemberID:localStorage.getItem('MemberID'),
        GoodsID:GoodsID,
      },
    });
  }

  componentDidMount() {
    const { dispatch,MemberAutoID,location:{state} } = this.props;
    this.getResult(dispatch,MemberAutoID,state&&state.goodsId||goodsId);
    this.reqRef = requestAnimationFrame(() => {
     this.getDay(dispatch,state&&state.goodsId||goodsId);
    });
    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection, { passive: true });
    this.handleScreenHeight();
    window.addEventListener('resize',this.handleScreenHeight);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    window.removeEventListener('resize', this.handleScreenHeight);
    this.setStepDirection.cancel();
    this.setStepDirection.cancel();
    const { dispatch } = this.props;
    dispatch({
      type: 'inverterChart/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  onOperationTabChange = key => {
    this.setState({ operationkey: key });
  };

  @Bind()
  @Debounce(200)
  setStepDirection() {
    const { stepDirection } = this.state;
    const w = getWindowWidth();
    if (stepDirection !== 'vertical' && w <= 576) {
      this.setState({
        stepDirection: 'vertical',
      });
    } else if (stepDirection !== 'horizontal' && w > 576) {
      this.setState({
        stepDirection: 'horizontal',
      });
    }
  }

  /**
   *根据不同的tab切换请求数据
   *
   * @memberof AdvancedProfile
   */
  ifTab=(key)=>{
    const { dispatch ,MemberAutoID,location:{state}} = this.props;
    switch(key){
      case 'info' :
        this.getDetails(dispatch,MemberAutoID,state&&state.goodsId||goodsId);
        break;
      case 'detail':
        this.getParameters(dispatch,MemberAutoID,state&&state.goodsId||goodsId);
        break;
      case 'Log':
        this.getLogs(dispatch,state&&state.goodsId||goodsId);
        break;
      default :
        this.getDay(dispatch,state&&state.goodsId||goodsId);
        break;
    }
  }

/**
 *tab改变
 *
 * @memberof AdvancedProfile
 */
  onTabChange = key => {
    this.setState({ OperationInfoKey: key });
    this.ifTab(key);
  };

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };

  ifStatus=(type,value)=>{
    const { dispatch,location:{state} } = this.props;
    switch(type){
      case 'year' :
        this.getYear(dispatch,state&&state.goodsId||goodsId,value);
        break;
      case 'month' :
        this.getMonth(dispatch,state&&state.goodsId||goodsId,value);
        this.setState({
          changeMonth:value,
        });
        break;
      default :
        this.getDay(dispatch,state&&state.goodsId||goodsId,value);
        this.setState({
          changeDay:moment(value).format('YYYY-MM-DD'),
        });
        break;
    }
  }
  handleRangePickerChange = value => {
    const type=this.state.statusType;
    this.ifStatus(type,value);
  };
  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      statusType:type,
    });
    this.ifStatus(type);
  };

  isActive = type => {
    const { statusType } = this.state;
    if(statusType===type) return styles.currentDate;
    return '';
  };

  //获取屏幕高度
  handleScreenHeight=()=>{
    let screenHeight=document.body.clientHeight-450;
    this.setState({
      screenHeight,
    });
  }
  handleClickMore=()=>{
    this.setState({
      moreStatus:!this.state.moreStatus
    });
  }

  render() {
    const { stepDirection, operationkey, OperationInfoKey ,rangePickerValue, 
      salesType, currentTabKey,statusType,changeMonth,changeDay,screenHeight,moreStatus} = this.state;
    const { inverterfile, loading ,inverterChart} = this.props;
    const { details, parameters, logs,inverterInfo } = inverterfile;
    const { inverterDay,inverterMonth,inverterYear} = inverterChart;
    const logsList=[];
      for(let i in logs){
        logsList.push(logs[i]);
      };
    const powerVdc=()=>{
      if(details.length!==0){
        let vdc=details.ACDCInfo.Vdc;
        let idc=details.ACDCInfo.Idc;
        if(vdc!==null&&idc!==null){
          console.log()
          return vdc.map((index,item)=><span>{vdc[item]/10}V / {idc[item]/100}A </span> 
          )
        }
      }
    };
    const contentInfoList = {
      line: (
        <Card>
          {/* <Area height={400} data={salesData} /> */}
          <SalesCard
            rangePickerValue={rangePickerValue}
            salesDay={inverterDay}
            salesMonth={inverterMonth}
            salesYear={inverterYear}
            isActive={this.isActive}
            handleRangePickerChange={this.handleRangePickerChange}
            loading={loading}
            selectDate={this.selectDate}
            statusType={statusType}
            changeMonth={changeMonth}
            changeDay={changeDay}
            screenHeight={screenHeight}
          />
        </Card>
      ),
      detail: (
        <Specificationo 
          loading={loading}
          parameters={parameters[0]}
          moreStatus={moreStatus}
          handleClickMore={this.handleClickMore}
        />
      ),
      Log: (
        <Card>
          <Table
            loading={loading}
            dataSource={logsList}
            columns={this.LogColumns}
          />
        </Card>
      ),
    };
    const description = (
      <Row >
        <Col span={4} >
          <div className={styles.textSecondary}>
            <FormattedMessage id="app.inverter.status" defaultMessage="status" />
          </div>
          <div className={styles.heading}>
          {
            inverterInfo.Light===1 ? formatMessage({ id: 'app.inverter.normal' }) :
            inverterInfo.Light===2 ? formatMessage({ id: 'app.inverter.fault' }) :
            inverterInfo.Light===3 ? formatMessage({ id: 'app.inverter.standby' }) :
            formatMessage({ id: 'app.inverter.offline' })
          }
          </div>
        </Col>
        <Col span={4} >
          <div className={styles.textSecondary}>
            <FormattedMessage id="app.inverter.list.power" defaultMessage="power" />
          </div>
          <div className={styles.heading}>{numberUnit(inverterInfo.CurrPac)+'W'}</div>
        </Col>
        <Col span={4} >
          <div className={styles.textSecondary}>
            <FormattedMessage id="app.inverter.parameter.e-today" defaultMessage="e-today" />
          </div>
          <div className={styles.heading}>{numberUnit(inverterInfo.EToday+'Wh')}</div>
        </Col>
        <Col span={4} >
          <div className={styles.textSecondary}>
            <FormattedMessage id="app.inverter.parameter.e-total" defaultMessage="e-total" />
          </div>
          <div className={styles.heading}>{numberUnit(inverterInfo.ETotal+'Wh')}</div>
        </Col>
        <Col span={4} >
          <div className={styles.textSecondary}>
            <FormattedMessage id="app.inverter.parameter.h-total" defaultMessage="h-total" />
          </div>
          <div className={styles.heading}>{numberUnit(inverterInfo.Htotal)}</div>
        </Col>
        <Col span={4} >
          <div className={styles.textSecondary}>
            <FormattedMessage id="app.inverter.total-income" defaultMessage="e-total-income" />
          </div>
          {/* <div className={styles.heading}>{numberUnit(inverterInfo.ETotal*inverterInfo.Price)}</div> */}
        </Col>
      </Row>
    );
    
    return (
      <PageHeaderWrapper
        title={inverterInfo!==0?inverterInfo.GoodsName:''}
        // logo={
        //   <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        // }
        // action={action}
        content={inverterInfo.length!==0?description:''}
        // extraContent={inverterInfo.length!==0?extra:''}
        tabList={tabList}
        onTabChange={this.onTabChange}
      >
        {contentInfoList[OperationInfoKey]}
      </PageHeaderWrapper>
    );
  }
}

export default props=>(<Inverterfile {...props} />);
