import React, { memo } from 'react';
import { Row, Col, Table, Tooltip, Card, Icon } from 'antd';
import { FormattedMessage } from 'umi/locale';
import Trend from 'ant-design-pro/lib/Trend';
import numeral from 'numeral';
import styles from './Analysis.less';
import NumberInfo from 'ant-design-pro/lib/NumberInfo';
import { MiniArea } from 'ant-design-pro/lib/Charts';
import {numberUnit} from '@/utils/utils';

const columns = [
  {
    title: <FormattedMessage id="app.analysis.table.rank" defaultMessage="Rank" />,
    dataIndex: 'key',
    key: 'key',
  },
  {
    title: <FormattedMessage id="app.analysis.plant" defaultMessage="Users" />,
    dataIndex: 'TypeName',
    key: 'TypeName',
  },
  {
    title: <FormattedMessage id="app.analysis.day-visits"/>,
    dataIndex: 'EToday',
    key: 'EToday',
    render: (text) => {
      return numberUnit(text)+'Wh';
    }
  },
];

const TopSearch = memo(({ loading, dayRank }) => (
  <Card
    loading={loading}
    bordered={false}
    title={
      <FormattedMessage id="app.analysis.sales-ranking" defaultMessage="ranking" />
    }
    style={{ marginTop: 24 }}
  >
    {/* <Table
      rowKey={record => record.key}
      size="small"
      columns={columns}
      dataSource={searchData}
      pagination={{
        style: { marginBottom: 0 },
        pageSize: 7,
      }}
    /> */}
    <Table
      rowKey={record => record.key}
      size="small"
      columns={columns}
      dataSource={dayRank}
      pagination={{
        style: { margin: 0,marginTop:'10px' },
        pageSize: 7,
      }}
    />
  </Card>
));

export default TopSearch;
