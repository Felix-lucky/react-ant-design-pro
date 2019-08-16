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
  Form,
  Input,
  Modal,
  message,
} from 'antd';
import classNames from 'classnames';
import { DescriptionList } from 'ant-design-pro';
import { FormattedMessage, formatMessage } from 'umi/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SalesCard from './SalesCard';
import { getTimeDistance } from '@/utils/utils';
import moment from 'moment';
import {numberUnit} from '@/utils/utils';
import CurrentMap from '@/components/googleMaps/currentMap'; 

import styles from './style.less';
import numeral from 'numeral';

const FormItem = Form.Item;
const { Step } = Steps;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;
const contentbox = null;
const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;
const groupAutoId=localStorage.getItem('groupId');

const tabList = [
  {
    key: 'line',
    tab: formatMessage({ id: 'app.inverter.chart' }),
  },
  {
    key: 'info',
    tab: formatMessage({ id: 'app.inverter.message-information' }),
  },
  {
    key: 'list',
    tab: formatMessage({ id: 'app.inverter.machine-list' }),
  },
  // {
  //   key: 'detail',
  //   tab: formatMessage({ id: 'app.inverter.parameter' }),
  // },
  {
    key: 'Log',
    tab: formatMessage({ id: 'app.inverter.logs' }),
  },
];


const status = [0,
  formatMessage({ id: 'app.inverter.normal' }),
  formatMessage({ id: 'app.inverter.fault' }),
  formatMessage({ id: 'app.inverter.standby' }),
  formatMessage({ id: 'app.inverter.offline' }),
];
const statusMap = [0,'success', 'error', 'warning', 'default'];

@Form.create()
@connect(({ advancedProfile, loading ,chart,global}) => ({
  MemberAutoID:global.MemberAutoID,
  advancedProfile,
  chart,
  loading: loading.effects['advancedProfile/detailInfo'],
  loading: loading.effects['advancedProfile/inverterList'],
  loading: loading.effects['advancedProfile/inverterParameter'],
  loading: loading.effects['advancedProfile/inverterLogs'],
  loading: loading.effects['advancedProfile/fetch'],
  loading: loading.effects['chart/fetchDaySum'],
}))
class AdvancedProfile extends Component {
  state = {
    operationkey: 'tab1',
    OperationInfoKey: 'line',
    stepDirection: 'horizontal',
    salesType: 'all',
    currentTabKey: 'group',
    statusType:'today',
    changeMonth:'',
    changeDay:moment().format('YYYY-MM-DD'),
    currDate:'',
    screenHeight:350,
    visible:false,
    current:{},
  };
  columns = [
    {
      title: formatMessage({ id: 'app.inverter.status' }),
      dataIndex: 'Light',
      filters: [
        {
          text: status[1],
          value: '1',
        },
        {
          text: status[2],
          value: '2',
        },
        {
          text: status[3],
          value: '3',
        },
        {
          text: status[4],
          value: '4',
        },
      ],
      render(val) {
        if(val!==0){
          return <Badge status={statusMap[val]} text={status[val]} />;
        }
      },
      onFilter: (value, record) => record.Light.toString().includes(value),
    },
    {
      title: formatMessage({ id: 'app.inverter.photo'}),
      render: (text,row) =>(
        <span className={styles.photo}>
          <img src={require('@/assets/plant.png')} alt=""/>
        </span>
      )
    },
    {
      title: formatMessage({ id: 'app.inverter.parameter.name' }),
      dataIndex: 'GoodsName',
      key: 'GoodsName',
      render: (text,row) => <a onClick={this.handleClick.bind(this,row.GoodsID)}>{text}</a>
    },
    {
      title: formatMessage({ id: 'app.inverter.parameter.current-power' }),
      dataIndex: 'CurrPac',
      key: 'CurrPac',
      render: (text) => {
        return numberUnit(text)+'W';
      }
    },
    {
      title: formatMessage({ id: 'app.inverter.parameter.e-today' }),
      dataIndex: 'EToday',
      key: 'EToday',
      render: (text) => {
        return numberUnit(text)+'Wh';
      }
    },
    {
      title: formatMessage({ id: 'app.inverter.parameter.e-total' }),
      dataIndex: 'ETotal',
      key: 'ETotal',
      render: (text) => {
        return numberUnit(text)+'Wh';
      }
    },
    {
      title: formatMessage({ id: 'app.inverter.parameter.h-total' }),
      dataIndex: 'Htotal',
      key: 'Htotal',
      render: (text) => {
        return numberUnit(text);
      }
    },
    {
      title: formatMessage({ id: 'app.inverter.operation' }),
      render: (text, row) => (
        <span>
          <a onClick={e => {
            e.preventDefault();
            this.showEditModal(row.AutoID,row.GoodsName);
          }}>
            <FormattedMessage id="app.inverter.edit" defaultMessage="edit" />
          </a>
        </span>
      ),
    },
  ];
  
  LogColumns = [
    {
      title: formatMessage({ id: 'app.inverter.parameter.S/N' }),
      dataIndex: 'GoodsID',
      key: 'GoodsID',
    },
    // {
    //   title: formatMessage({ id: 'app.inverter.parameter.name' }),
    //   dataIndex: 'name',
    //   key: 'name',
    // },
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

  //显示 弹窗
  showEditModal = (id,name) => {
    this.setState({
      visible: true,
      current: {
        GoodsAutoID:id,
        Name:name,
      },
    });
  };

 //取消 隐藏弹窗
 handleCancel = () => {
  this.setState({
    visible: false,
  });
};

handleSubmit = e => {
  e.preventDefault();
  const { dispatch, form } = this.props;
  const { current:{GoodsAutoID} } = this.state;
  form.validateFields((err, values) => {
    if (err) return;
    dispatch({
      type: 'advancedProfile/submits',
      payload: { 
        GoodsAutoID:GoodsAutoID,
        ...values,
       },
    });
  });
  setTimeout(()=>{
    const { dispatch,advancedProfile:{editStatus},MemberAutoID,location:{state}} = this.props;
    editStatus?message.success(formatMessage({ id: 'app.inverter.successful-operation' }))
    :message.error(formatMessage({ id: 'app.inverter.error-operation' }));
    this.getInverterList(dispatch,MemberAutoID,state&&state.id||groupAutoId);
  },1000);
  this.setState({
    visible: false,
  });
};

  handleClick=(id)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'advancedProfile/fetchId',
      payload:{
        goodsId:id,
      },
    });
    localStorage.setItem('goodsId',id);
  }
  
  /**
   *日单机发电量
   *
   * @memberof AdvancedProfile
   */
  getDay=(dispatch,GroupAutoId,value)=>{
    dispatch({
      type: 'chart/fetchDay',
      payload:{
        GroupAutoID:GroupAutoId,
        date:moment(value).format('YYYY-MM-DD'),
      },
    });
  }

  /**
   *日群组发电量总和
   *
   * @memberof AdvancedProfile
   */
  getDaySum=(dispatch,GroupAutoId,value)=>{
    dispatch({
      type: 'chart/fetchDaySum',
      payload:{
        GroupAutoID:GroupAutoId,
        date:moment(value).format('YYYY-MM-DD'),
      },
    });
  }
/**
   *月单机发电量
   *
   * @memberof AdvancedProfile
   */
  getMonth=(dispatch,GroupAutoId,value)=>{
    dispatch({
      type: 'chart/fetchMonth',
      payload:{
        GroupAutoID:GroupAutoId,
        date:moment(value).format('YYYY-MM'),
      },
    });
  }

  /**
   *月群组发电量总和
   *
   * @memberof AdvancedProfile
   */
  getMonthSum=(dispatch,GroupAutoId,value)=>{
    dispatch({
      type: 'chart/fetchMonthSum',
      payload:{
        GroupAutoID:GroupAutoId,
        date:moment(value).format('YYYY-MM'),
      },
    });
  }
  /**
   *年单机发电量
   *
   * @memberof AdvancedProfile
   */
  getYear=(dispatch,GroupAutoId,value)=>{
    dispatch({
      type: 'chart/fetchYear',
      payload:{
        GroupAutoID:GroupAutoId,
        date:moment(value).format('YYYY'),
      },
    });
  }

  /**
   *年群组发电量总和
   *
   * @memberof AdvancedProfile
   */
  getYearSum=(dispatch,GroupAutoId,value)=>{
    dispatch({
      type: 'chart/fetchYearSum',
      payload:{
        GroupAutoID:GroupAutoId,
        date:moment(value).format('YYYY'),
      },
    });
  }

  /**
   *讯息资讯
   *
   * @memberof AdvancedProfile
   */
  getDetailInfo=(dispatch,MemberAutoID,GroupAutoId)=>{
    dispatch({
      type: 'advancedProfile/detailInfo',
      payload:{
        MemberAutoID:MemberAutoID,
        GroupAutoID:GroupAutoId,
      },
    });
  }

/**
   *机器列表
   *
   * @memberof AdvancedProfile
   */
  getInverterList=(dispatch,MemberAutoID,GroupAutoId)=>{
    dispatch({
      type: 'advancedProfile/inverterList',
      payload:{
        MemberAutoID:MemberAutoID,
        GroupAutoID:GroupAutoId,
      },
    });
  }

  /**
   *详细参数
   *
   * @memberof AdvancedProfile
   */
  getParameter=(dispatch,MemberAutoID,GroupAutoId)=>{
    dispatch({
      type: 'advancedProfile/inverterParameter',
      payload:{
        MemberAutoID:MemberAutoID,
        GroupAutoID:GroupAutoId,
      },
    });
  }

  /**
   *历史信息
   *
   * @memberof AdvancedProfile
   */
  getLogsList=(dispatch,GroupAutoId)=>{
    dispatch({
      type: 'advancedProfile/inverterLogs',
      payload:{
        MemberID:localStorage.getItem('MemberID'),
        GroupAutoID:GroupAutoId,
      },
    });
  }

  componentDidMount() {
    const { dispatch ,MemberAutoID,location:{state}} = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'advancedProfile/fetch',
        payload:{
          MemberAutoID:MemberAutoID,
          GroupAutoId:state&&state.id||groupAutoId,
        },
      });
      this.getDay(dispatch,state&&state.id||groupAutoId);
    });
    this.setStepDirection();
    this.handleScreenHeight();
    window.addEventListener('resize', this.setStepDirection, { passive: true });
    window.addEventListener('resize',this.handleScreenHeight);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    window.removeEventListener('resize',this.handleScreenHeight);
    this.setStepDirection.cancel();
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
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
        this.getDetailInfo(dispatch,MemberAutoID,state&&state.id||groupAutoId);
        break;
      case 'list':
        this.getInverterList(dispatch,MemberAutoID,state&&state.id||groupAutoId);
        break;
      case 'detail':
        this.getParameter(dispatch,MemberAutoID,state&&state.id||groupAutoId);
        break;
      case 'Log':
        this.getLogsList(dispatch,state&&state.id||groupAutoId);
        break;
      default :
        this.getDay(dispatch,state&&state.id||groupAutoId);
        this.getDaySum(dispatch,state&&state.id||groupAutoId);
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
    const type=this.state.statusType;
    const value=this.state.currDate;
    this.setState({
      currentTabKey: key,
    });
    value===''&&this.ifStatus(type,key);
    value!==''&&this.ifStatus(type,key,value);
  };

  ifStatus=(type,key,value)=>{
    const { dispatch,location:{state} } = this.props;
    switch(type){
      case 'year' :
        key==='single'&&this.getYear(dispatch,state&&state.id||groupAutoId,value);
        key==='group'&&this.getYearSum(dispatch,state&&state.id||groupAutoId,value);
        break;
      case 'month' :
        key==='single'&&this.getMonth(dispatch,state&&state.id||groupAutoId,value);
        key==='group'&&this.getMonthSum(dispatch,state&&state.id||groupAutoId,value);
        this.setState({
          changeMonth:value,
        });
        break;
      default :
        key==='group'&&this.getDay(dispatch,state&&state.id||groupAutoId,value);
        key==='single'&&this.getDaySum(dispatch,state&&state.id||groupAutoId,value);
        this.setState({
          changeDay:moment(value).format('YYYY-MM-DD'),
        });
        break;
    }
  }
  handleRangePickerChange = value => {
    const type=this.state.statusType;
    const key=this.state.currentTabKey;
    this.setState({
      currDate:value,
    });
    this.ifStatus(type,key,value);
  };

  selectDate = type => {
    const { dispatch } = this.props;
    const key=this.state.currentTabKey;
    this.setState({
      statusType:type,
    });
    this.ifStatus(type,key);
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
  render() {
    const { stepDirection, operationkey, OperationInfoKey ,
      rangePickerValue, salesType, currentTabKey,statusType,
      changeMonth,changeDay,screenHeight,current,visible,} = this.state;
    const { advancedProfile, loading,chart,form: { getFieldDecorator }, } = this.props;
    const {advancedInfo,detailInfo,inverterList,parameterList,logsList } = advancedProfile;
    const { dayLine,dayLineSum,monthLineSum,monthLine,yearLineSum,yearLine} = chart;
    const newLogsList=[];
    if(logsList.length>0){
      logsList.map(item=>{
        for(let i in item){
          newLogsList.push(item[i]);
        };
      });
    }
    const description = (
      <Row >
        <Col span={4} >
          <div className={styles.textSecondary}>
            <FormattedMessage id="app.inverter.status" defaultMessage="status" />
          </div>
          <div className={styles.headingTop}>
            {
                advancedInfo.Light===1 ? formatMessage({ id: 'app.inverter.normal' }) :
                advancedInfo.Light===2 ? formatMessage({ id: 'app.inverter.fault' }) :
                advancedInfo.Light===3 ? formatMessage({ id: 'app.inverter.standby' }) :
                formatMessage({ id: 'app.inverter.offline' })
              }
          </div>
        </Col>
        <Col span={4} >
          <div className={styles.textSecondary}>
            <FormattedMessage id="app.inverter.list.power" defaultMessage="power" />
          </div>
          <div className={styles.headingTop}>{numberUnit(advancedInfo.CurrPac)+'W'}</div>
        </Col>
        <Col span={4} >
          <div className={styles.textSecondary}>
            <FormattedMessage id="app.inverter.parameter.e-today" defaultMessage="e-today" />
          </div>
          <div className={styles.headingTop}>{numberUnit(advancedInfo.EToday+'Wh')}</div>
        </Col>
        <Col span={4}>
          <div className={styles.textSecondary}>
            <FormattedMessage id="app.inverter.parameter.e-total" defaultMessage="e-total" />
          </div>
          <div className={styles.headingTop}>{numberUnit(advancedInfo.ETotal+'Wh')}</div>
        </Col>
        <Col span={4} >
          <div className={styles.textSecondary}>
            <FormattedMessage id="app.inverter.parameter.h-total" defaultMessage="h-total" />
          </div>
          <div className={styles.headingTop}>{numberUnit(advancedInfo.Htotal)}</div>
        </Col>
        <Col span={4} >
          <div className={styles.textSecondary}>
            <FormattedMessage id="app.inverter.total-income" defaultMessage="e-total-income" />
          </div>
          <div className={styles.headingTop}>{numberUnit(advancedInfo.ETotal*advancedInfo.Price)}</div>
        </Col>
      </Row>
    );
    
    const textInfo=(
      <div className={styles.plantInfo}>
        <div className={styles.plantDetail}>
          <div className={styles.plantDetailInfo}>
            <p className={styles.plantItem}>
              <span><FormattedMessage id="app.inverter.name" defaultMessage="status" />：</span>
              <span>{advancedInfo.GoodsTypeName}</span>
            </p>
            <p className={styles.plantItem}>
              <span><FormattedMessage id="app.inverter.address" defaultMessage="status" />：</span>
              <span>{}</span>
            </p>
            <p className={styles.plantItem}>
              <span><FormattedMessage id="app.inverter.installation-time" defaultMessage="installation" />：</span>
              <span>{advancedInfo.CreateDate}</span>
            </p>
            <p className={styles.plantItem}>
              <span><FormattedMessage id="app.inverter.capacity" defaultMessage="capacity" />：</span>
              <span>{numberUnit(advancedInfo.GoodsKWP)+'Wp'}</span>
            </p>
          </div>
          <div className={styles.plantImg}>
            <img src={require('@/assets/222.png')} alt=""/>
          </div>
        </div>
        <div className={styles.plantStatus}>
          <Row>
            <Col span={6}>
              <div className={styles.textSecondary}>
                <FormattedMessage id="app.inverter.power.input" defaultMessage="power.input" />
              </div>
              <div className={styles.heading}>{detailInfo.CurrPdc+'W'}</div>
            </Col>
            <Col span={6}>
              <div className={styles.textSecondary}>
                <FormattedMessage id="app.inverter.power.output" defaultMessage="power.output" />
              </div>
              <div className={styles.heading}>{detailInfo.CurrPac+'W'}</div>
            </Col>
            <Col span={6}>
              <div className={styles.textSecondary}>CO2</div>
              <div className={styles.heading}>{detailInfo.co2+'t'}</div>
            </Col>
            <Col span={6}>
              <div className={styles.textSecondary}>
                <FormattedMessage id="app.inverter.tree" defaultMessage="tree" />
              </div>
              <div className={styles.heading}>{}</div>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <div className={styles.textSecondary}>
                <FormattedMessage id="app.inverter.relative-yield" defaultMessage="relative-yield" />
              </div>
              <div className={styles.heading}>{}</div>
            </Col>
            <Col span={6}>
              <div className={styles.textSecondary}>
                <FormattedMessage id="app.inverter.weather" defaultMessage="weather" />
              </div>
              <div className={styles.heading}>{}</div>
            </Col>
            <Col span={6}>
              <div className={styles.textSecondary}>
              <FormattedMessage id="app.inverter.city-temp" defaultMessage="city-temp" />
              </div>
              <div className={styles.heading}>{}</div>
            </Col>
            <Col span={6}>
              <div className={styles.textSecondary}>
                <FormattedMessage id="app.inverter.inv-temp" defaultMessage="inv-temp" />
              </div>
              <div className={styles.heading}>{}</div>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <div className={styles.textSecondary}>
                <FormattedMessage id="app.inverter.radiation" defaultMessage="radiation" />
              </div>
              <div className={styles.heading}>{}</div>
            </Col>
          </Row>
        </div>
      </div>
    );


    const contentInfoList = {
      line: (
        <Card>
          <SalesCard
            salesDay={dayLine}
            dayLineSum={dayLineSum}
            salesMonth={monthLine}
            salesYear={yearLine}
            monthLineSum={monthLineSum}
            yearLineSum={yearLineSum}
            isActive={this.isActive}
            handleRangePickerChange={this.handleRangePickerChange}
            loading={loading}
            selectDate={this.selectDate}
            statusType={statusType}
            changeMonth={changeMonth}
            changeDay={changeDay}
            handleTabChange={this.handleTabChange}
            screenHeight={screenHeight}
          />
        </Card>
      ),
      info: (
        <Row gutter={16}>
          <Col  md={16} lg={17} xxl={18} >
            <Card >
              {textInfo}
            </Card>
          </Col>
          <Col  md={8} lg={7} xxl={6}>
          <Card >
            <div className={styles.cardMap}>
                <CurrentMap />
            </div>
          </Card>
        </Col>
        </Row>
        
      ),
      list: (
        <Card>
          <Table
          rowKey={record => record.GoodsID}
            // pagination={false}
            loading={loading}
            dataSource={inverterList}
            columns={this.columns}
          />
        </Card>
      ),
      Log: (
        <Card>
          <Table
          loading={loading}
          dataSource={newLogsList}
          columns={this.LogColumns}
        />
        </Card>
      ),
    };

     //表单
     const getModalContent =(
      <Form onSubmit={this.handleSubmit}>
          <FormItem label={formatMessage({ id: 'app.inverter.inverter-name' })} {...this.formLayout}>
            {getFieldDecorator('Name', {
              rules: [{ required: true, message: formatMessage({ id: 'app.inverter.inverter-name-input' }) }],
              initialValue: current.Name,
            })(<Input  />)}
          </FormItem>
        </Form>
    );

    return (
      <PageHeaderWrapper
        title={advancedInfo.length!==0?advancedInfo.GoodsTypeName:''}
        // logo={
        //   <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        // }
        content={advancedInfo.length !== 0 ? description : ''}
        // extraContent={advancedInfo.length!==0?extra:''}
        tabList={tabList}
        onTabChange={this.onTabChange}
      >
        {contentInfoList[OperationInfoKey]}
        <Modal
          title={formatMessage({ id: 'app.inverter.edit-group' })}
          // className={styles.standardListForm}
          width={500}
          destroyOnClose
          visible={visible}
          onOk={this.handleSubmit}
           onCancel={this.handleCancel}
        >
          {getModalContent}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default props=>(<AdvancedProfile {...props} />);
