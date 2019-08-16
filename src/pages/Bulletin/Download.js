import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Icon, List, Button ,} from 'antd';

import styles from './download.less';

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
class Download extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'list/fetch',
    //   payload: {
    //     count: 5,
    //   },
    // });
  }
  render() {
    const {
      loading,
      list: { list },
    } = this.props;
    
    return (
      <div className={styles.downloadContainer}>
          <h2 className={styles.downloadTitle}><FormattedMessage id="app.bulletin.manual" /></h2>
          <List     
          // loading={list.length === 0 ? loading : false}
          itemLayout="horizontal"
        //   loadMore={loadMore}
        //   dataSource={list}
        >
            <List.Item actions={
                    [<a href='http://www.senergytec.cn/doc/614-37031-02.pdf' target='_blank' download style={{ fontSize: '22px' }}>
                    <Icon type="cloud-download" />
                </a>]
                }>
                    <List.Item.Meta
                    title='监控网页使用手册'
                    />
            </List.Item>
            <List.Item actions={
                    [<a href='http://www.senergytec.cn/doc/extlogger_finder.7z'  download style={{ fontSize: '22px' }}>
                    <Icon type="cloud-download" />
                </a>]
                }>
                    <List.Item.Meta
                    title='资料收集器使用手册'
                    />
            </List.Item>
        </List>
      </div>
    );
  }
}

export default Download;