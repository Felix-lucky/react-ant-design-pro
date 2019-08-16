import React, { Component } from 'react';
import moment from 'moment';
import router from 'umi/router';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { Button, DatePicker, List, Card, Icon, Tag } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ArticleListContent from '@/components/ArticleListContent';
import styles from './Logs.less';
const { RangePicker } = DatePicker;

@connect(({ logs, loading,global }) => ({
  MemberAutoID:global.MemberAutoID,
  logs,
  loading: loading.effects['logs/fetch'],
}))
class Logs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rangePickerValue: [moment(), moment()],// 默认7天历史信息
    };
  }
  
  /**
   *获取历史信息
   *参数number默认为第一页
   * @memberof Logs
   */
  getData=()=>{
    const { dispatch,MemberAutoID } = this.props;
    const { rangePickerValue }=this.state;
    let params={
      Page: 1,
      MemberID:localStorage.getItem('MemberID'),
      SDate:rangePickerValue[0].format('YYYY-MM-DD'),
      EDate:rangePickerValue[1].format('YYYY-MM-DD'),
    };
    dispatch({
      type: 'logs/fetch',
      payload: {
        ...params,
      },
    });
  }
  componentDidMount() {
    this.getData();
  }
  //加载更多
  fetchMore = () => {
      const { dispatch,logs ,MemberAutoID} = this.props;
      const { rangePickerValue  }=this.state;
      let params={
        Page: logs.count,
        MemberID:localStorage.getItem('MemberID'),
        SDate:rangePickerValue[0].format('YYYY-MM-DD'),
        EDate:rangePickerValue[1].format('YYYY-MM-DD'),
      };
      dispatch({
        type: 'logs/add',
        payload: {
          ...params,
        },
      });
      dispatch({
        type: 'logs/number',
      });
  };
  //时间change
  handleRangePickerChange = dateStrings => {
    let rangePickerValue = [moment(dateStrings[0]), moment(dateStrings[1])];
    this.setState({
      rangePickerValue,
    });
  };
  //搜索
  handleClick=()=>{
    this.getData();
  }
  render() {
    const { rangePickerValue } = this.state;
    const {
      loading,
      logs: { list },logs:{ ifNumber },
    } = this.props;
    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );
    const mainSearch = (
      <div className={styles.dateSearch}>
        <RangePicker
          value={rangePickerValue}
          onChange={this.handleRangePickerChange}
          style={{ width: 256 }}
        />
        <Button
          type="primary"
          style={{ marginLeft: '20px' }}
          onClick={() => this.handleClick(rangePickerValue)}
        >
          <FormattedMessage id="app.logs.search" defaultMessage="All Month" />
        </Button>
      </div>
    );
    const loadMore =
      list.length > 0 ? (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button onClick={this.fetchMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
          {loading ? (
              <span>
                <Icon type="loading" /> <FormattedMessage id="app.logs.loading" />
              </span>
            ) : formatMessage({ id: 'app.logs.load-more' })
            }
          </Button>
        </div>
      ) : null;
    return (
      <PageHeaderWrapper content={mainSearch}>
        <Card
          style={{ marginTop: 24 }}
          bordered={false}
          bodyStyle={{ padding: '8px 32px 32px 32px' }}
        >
          <List
            size="large"
            loading={list.length === 0 ? loading : false}
            rowKey="id"
            itemLayout="vertical"
            loadMore={ifNumber?loadMore:(<div style={{ textAlign: 'center', marginTop: 16 }}><FormattedMessage id="app.logs.loading-none" /></div>)}
            dataSource={list}
            renderItem={(item,index) => (
              <List.Item
                key={index}
              >
                <List.Item.Meta
                  title={
                    <a
                      className={styles.listItemMetaTitle}
                      // href={item.href}
                    >
                      {item.GoodsID}
                    </a>
                  }
                />
                <ArticleListContent data={item} />
              </List.Item>
            )}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default props=>(
  <Logs {...props} />
);
