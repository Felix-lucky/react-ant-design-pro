import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { Row, Col, Card, List, Avatar, Badge, Divider ,Icon} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import {numberUnit} from '@/utils/utils';
import styles from './Monitor.less';

const status = [0,
  formatMessage({ id: 'app.monitor.normal' }),
  formatMessage({ id: 'app.monitor.fault' }),
  formatMessage({ id: 'app.monitor.standby' }),
  formatMessage({ id: 'app.monitor.offline' }),
];
const statusMap = [0,'success', 'error', 'warning', 'default'];
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
@connect(({  loading, rule ,global}) => ({
  MemberAutoID:global.MemberAutoID,
  rule,
  loading: loading.models.rule,
  // currentUserLoading: loading.effects['user/fetchCurrent'],
}))
class Workplace extends PureComponent {
  state = {
    selectedRows: [],
    formVals: {
      name: '',
      desc: '',
      key: '',
      target: '0',
      template: '0',
      type: '1',
      time: '',
      frequency: 'month',
    },
    currentStep: 0,
  };
  columns = [
    {
      title: formatMessage({ id: 'app.monitor.acount' }),
      dataIndex: 'MemberID',
      render: (text,row) => <a onClick={this.handleClick.bind(this,row.AutoID)}>{text}</a>
    },
    {
      title: formatMessage({ id: 'app.monitor.status' }),
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
      title: formatMessage({ id: 'app.monitor.power' }),
      dataIndex: 'CurrPac',
      render: (text) => {
        return numberUnit(text)+'W';
      }
    },
    {
      title: formatMessage({ id: 'app.monitor.e-today' }),
      dataIndex: 'EToday',
      render: (text) => {
        return numberUnit(text)+'Wh';
      }
    },
    {
      title: formatMessage({ id: 'app.monitor.e-total' }),
      dataIndex: 'Etotal',
      render: (text) => {
        return numberUnit(text)+'Wh';
      }
    },
    {
      title: formatMessage({ id: 'app.monitor.total-income' }),
      render :(text, record, index)=>{
        return numberUnit(record.Etotal*record.Price);
      }
    },
    {
      title: formatMessage({ id: 'app.monitor.capacity' }),
      dataIndex: 'GoodsKWP',
      render: (text) => {
        return numberUnit(text)+'Wh';
      }
    },
    {
      title: formatMessage({ id: 'app.monitor.installation-time' }),
      dataIndex: 'CreateDate',
    },
  ];
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
  };
  componentDidMount() {
    const { dispatch,MemberAutoID } = this.props;
    dispatch({
      type: 'rule/fetch',
      payload:{
        MemberAutoID:MemberAutoID,
      },
    });
  }
  handleClick=(text)=>{
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'rule/acountId',
    //   payload:{
    //     autoId:text.toString(),
    //   },
    // });
  }
 
  render() {
    const {
      // currentUser,
      // currentUserLoading,
      rule: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <div className={styles.stateItemImg} style={{height:'50px'}}>
            <img src={require('@/assets/user.png')} alt="user"/>
          </div>
          <div>
            <p>
              <FormattedMessage id="app.monitor.account-number" />
            </p>
            <p>{data.account}</p>
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.stateItemImg} >
            <img src={require('@/assets/online.png')} alt="online"/>
          </div>
          <div>
          <p>
            <FormattedMessage id="app.monitor.normal-number" />
          </p>
          <p>{data.normal}</p>
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.stateItemImg}>
            <img src={require('@/assets/fault.png')} alt="fault"/>
          </div>
          <div>
            <p>
              <FormattedMessage id="app.monitor.fault-number" />
            </p>
            <p>{data.fault}</p>
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.stateItemImg}>
            <img src={require('@/assets/stanby.png')} alt="stanby"/>
          </div>
          <div>
            <p>
              <FormattedMessage id="app.monitor.standby-number" />
            </p>
            <p>{data.standby}</p>
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.stateItemImg}>
            <img src={require('@/assets/offline.png')} alt="offline"/>
          </div>
          <div>
            <p>
              <FormattedMessage id="app.monitor.offline-number" />
            </p>
            <p>{data.offline}</p>
          </div>
        </div>
      </div>
    );
    return (
      <PageHeaderWrapper
        // loading={currentUserLoading}
        // content={pageHeaderContent}
        extraContent={extraContent}
      >
        <div className={styles.tableList}>
          <StandardTable
            // selectedRows={selectedRows}
            loading={loading}
            data={data}
            columns={this.columns}
            // onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default props => (
  //   <AsyncLoadBizCharts>
  <Workplace {...props} />
  //   </AsyncLoadBizCharts>
);
