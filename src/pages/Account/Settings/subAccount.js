import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Icon, List, Button } from 'antd';

const pageSize = 5;

@connect(({ account,loading ,global }) => ({
  account,
  MemberAutoID:global.MemberAutoID,
  deleteStatus: account.deleteStatus,
  loading: loading.effects['account/sub'],
}))
class subAccount extends Component {
  getResult=()=>{
    const { dispatch ,MemberAutoID} = this.props;
    let params={
      MemberAutoID:MemberAutoID,
      Page:1,
    }
    dispatch({
      type: 'account/sub',
      payload: {
        ...params,
      },
    });
  }
  componentDidMount() {
    this.getResult();
  }
  fetchMore = () => {
    const { dispatch ,account,MemberID} = this.props;
    let params={
      MemberAutoID:MemberAutoID,
      Page:account.count,
    }
    dispatch({
      type: 'account/add',
      payload: {
        ...params,
      },
    });
    dispatch({
      type: 'account/number',
    });
  };
  //点击删除当前子账号
  handleClick = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/delete',
      payload: {
        MemberID:value,
      },
    });
    setTimeout(()=>{
      this.getResult();
    },1000)
  };
  render() {
    const {
      loading,
      account: { subAccount,ifNumber },
    } = this.props;
    const loadMore =
    subAccount.length > 0 ? (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button onClick={this.fetchMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
            {loading ? (
              <span>
                <Icon type="loading" /> <FormattedMessage id="app.settings.sub.loading" />
              </span>
            ) : (
              formatMessage({ id: 'app.settings.sub.load-more' })
            )}
          </Button>
        </div>
      ) : null;
    return (
      <Fragment>
        <List
          loading={subAccount.length === 0 ? loading : false}
          itemLayout="horizontal"
          loadMore={ifNumber?loadMore:(<div style={{ textAlign: 'center', marginTop: 16 }}><FormattedMessage id="app.logs.loading-none" /></div>)}
          dataSource={subAccount}
          renderItem={item => {
            //判断是否当前账号
            let action =
            //   item.fid === 0
            //     ? []
            //     : [
                    [<a onClick={this.handleClick.bind(this, item.MemberID)} style={{ fontSize: '22px' }}>
                      <Icon type="delete" />
                    </a>]
            //       ];
            return (
              <List.Item actions={action}>
                <List.Item.Meta
                  title={formatMessage({ id: 'app.settings.sub.sub-account' })}
                  description={item.MemberID}
                />
              </List.Item>
            );
          }}
        />
      </Fragment>
    );
  }
}

export default subAccount;
