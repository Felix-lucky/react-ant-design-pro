import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { Row, Col, Icon, Menu, Dropdown } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';
import styles from './Analysis.less';
import PageLoading from '@/components/PageLoading';
// import { AsyncLoadBizCharts } from '@/components/Charts/AsyncLoadBizCharts';

const IntroduceRow = React.lazy(() => import('./IntroduceRow'));
const SalesCard = React.lazy(() => import('./SalesCard'));
const TopSearch = React.lazy(() => import('./TopSearch'));
const ProportionSales = React.lazy(() => import('./ProportionSales'));
// const OfflineData = React.lazy(() => import('./OfflineData'));

const status = {
  Green:formatMessage({ id: 'app.monitor.normal' }),
  red:formatMessage({ id: 'app.monitor.fault' }),
  yellow:formatMessage({ id: 'app.monitor.standby' }),
  gray:formatMessage({ id: 'app.monitor.offline' }),
};

@connect(({ analysis,global,loading }) => ({
  MemberAutoID:global.MemberAutoID,
  analysis,
  loading: loading.effects['analysis/fetch'],
}))
class Analysis extends Component {
  state = {
    salesType: 'all',
    currentTabKey: 'group',
    statusType:'today',
    changeMonth:'',
    changeDay:moment().format('YYYY-MM-DD'),
  };

  componentDidMount() {
    const { dispatch,MemberAutoID} = this.props;
    this.reqRef = requestAnimationFrame(() => {
      //发送请求数据
      dispatch({
        type: 'analysis/fetch',
        payload:{
          MemberAutoID:MemberAutoID,
        },
      });
      dispatch({
        type: 'analysis/ranking',
        payload:{
          MemberAutoID:MemberAutoID,
          date:moment().format('YYYY-MM-DD'),
        },
      });
      // this.getDay(dispatch,MemberAutoID);
    });
  }

  /**
   *获取日发电功率
   *dispatch,
   * MemberAutoID,
   * value 日期
   * @memberof Analysis
   */
  getDay=(dispatch,MemberAutoID,value)=>{
    dispatch({
      type: 'analysis/day',
      payload:{
        MemberAutoID:MemberAutoID,
        date:moment(value).format('YYYY-MM-DD'),
      },
    });
  }
  /**
   *获取月发电量
   *dispatch,
   * MemberAutoID,
   * value 日期
   * @memberof Analysis
   */
  getMonth=(dispatch,MemberAutoID,value)=>{
    dispatch({
      type: 'analysis/month',
      payload:{
        MemberAutoID:MemberAutoID,
        date:moment(value).format('YYYY-MM'),
      },
    });
  }
  /**
   *获取年发电量
   *dispatch,
   * MemberAutoID,
   * value 日期
   * @memberof Analysis
   */
  getYear=(dispatch,MemberAutoID,value)=>{
    dispatch({
      type: 'analysis/year',
      payload:{
        MemberAutoID:MemberAutoID,
        Year:moment(value).format('YYYY'),
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'analysis/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = key => {
    const { dispatch,MemberAutoID } = this.props;
    if(key==='sales'){
      this.getDay(dispatch,MemberAutoID);
    }
    this.setState({
      currentTabKey: key,
    });
  };
  ifStatus=(type,value)=>{
    const { dispatch,MemberAutoID } = this.props;
    switch(type){
      case 'year' :
        this.getYear(dispatch,MemberAutoID,value);
        break;
      case 'month' :
        this.getMonth(dispatch,MemberAutoID,value);
        this.setState({
          changeMonth:value,
        });
        break;
      default :
        this.getDay(dispatch,MemberAutoID,value);
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

    //点击滚动到底部
  handleScroll=(even)=>{
    let scrollHeight=document.documentElement.scrollHeight || document.body.scrollHeight;
    document.body.scrollTop = document.documentElement.scrollTop = scrollHeight;
  }

  render() {
    const { salesType, currentTabKey,statusType ,changeMonth,changeDay} = this.state;
    const { analysis, loading,} = this.props;
    const {
      visitData,
      searchData,
      offlineData,
      offlineChartData,
      AllUserLight,
      AllLight,
      dayRank,
      salesDay,
      salesMonth,
      salesYear,
    } = analysis;
    const salesPieData=[];
    for(let i in AllLight){
      salesPieData.push({
        x:status[i],
        y:AllLight[i]
      })
    }
    if(dayRank.length>0){
      for(let j=0;j<dayRank.length;j++){
        dayRank[j].key=j+1;
      }
    }
    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          <IntroduceRow loading={loading} visitData={visitData} handleScroll={this.handleScroll} />
        </Suspense>
        <Suspense fallback={null}>
          <SalesCard
            salesDay={salesDay}
            salesMonth={salesMonth}
            salesYear={salesYear}
            isActive={this.isActive}
            handleRangePickerChange={this.handleRangePickerChange}
            loading={loading}
            selectDate={this.selectDate}
            statusType={statusType}
            dayRank={dayRank}
            changeMonth={changeMonth}
            changeDay={changeDay}
            handleTabChange={this.handleTabChange}
            currentTabKey={currentTabKey}
          />
        </Suspense>
        <div className={styles.twoColLayout}>
          <Row gutter={24}>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <TopSearch
                  loading={loading}
                  dayRank={dayRank}
                />
              </Suspense>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <ProportionSales
                  // dropdownGroup={dropdownGroup}
                  salesType={salesType}
                  loading={loading}
                  salesPieData={salesPieData}
                  handleChangeSalesType={this.handleChangeSalesType}
                />
              </Suspense>
            </Col>
          </Row>
        </div>
        <Suspense fallback={null}>
          {/* <OfflineData
            activeKey={activeKey}
            loading={loading}
            offlineData={offlineData}
            offlineChartData={offlineChartData}
            handleTabChange={this.handleTabChange}
          /> */}
        </Suspense>
      </GridContent>
    );
  }
}

export default props => (
    // <AsyncLoadBizCharts>
  <Analysis {...props} />
    //  {/* </AsyncLoadBizCharts> */}
);
