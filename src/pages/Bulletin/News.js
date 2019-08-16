import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { Button, List, Card, Icon, Tag } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ArticleListContent from '@/components/ArticleListContent';
import styles from './news.less';
const pageSize = 5;

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rangePickerValue: [moment().subtract(7, 'days'), moment()],
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'list/fetch',
    //   payload: {
    //     count: 5,
    //   },
    // });
  }
  fetchMore = () => {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'list/appendFetch',
    //   payload: {
    //     count: pageSize,
    //   },
    // });
  };
  handleRangePickerChange = dateStrings => {
    console.log(dateStrings);
    let rangePickerValue = [moment(dateStrings[0]), moment(dateStrings[1])];
    this.setState({
      rangePickerValue,
    });
  };

  render() {
    const { rangePickerValue } = this.state;
    const {
      loading,
      list: { list },
    } = this.props;
    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
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
      <PageHeaderWrapper>
        <Card
        //   style={{ marginTop: 24 }}
          bordered={false}
          bodyStyle={{ padding: '8px 32px 32px 32px' }}
        >
          <List
            size="large"
            loading={list.length === 0 ? loading : false}
            rowKey="id"
            itemLayout="vertical"
            loadMore={loadMore}
            dataSource={list}
            renderItem={item => (
              <List.Item
                key={item.id}
                // actions={[  图标
                //   <IconText type="star-o" text={item.star} />,
                //   <IconText type="like-o" text={item.like} />,
                //   <IconText type="message" text={item.message} />,
                // ]}
                // extra={<div className={styles.listItemExtra} />}
              >
                <List.Item.Meta
                  title={
                    <a
                      className={styles.listItemMetaTitle}
                      // href={item.href}
                    >
                      {item.title}
                    </a>
                  }
                  // description={
                  //   <span>
                  //     <Tag>Ant Design</Tag>
                  //     <Tag>设计语言</Tag>
                  //     <Tag>蚂蚁金服</Tag>
                  //   </span>
                  // }
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

export default News;
