import React, { memo } from 'react';
import { Row, Col, Card, Tabs, DatePicker,Table,Button} from 'antd';
import { FormattedMessage, formatMessage } from 'umi/locale';
import YearPicker from '@/components/YearPicker/YearPicker';
import moment from 'moment';
import numeral from 'numeral';
import styles from './Analysis.less';
// import { Bar } from 'ant-design-pro/lib/Charts';
import Area from '@/components/Charts/Area';
import Bar from '@/components/Charts/Bar';
import {numberUnit} from '@/utils/utils';
import GroupList from './GroupList';

const { RangePicker,MonthPicker } = DatePicker;
const { TabPane } = Tabs;
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
    title: <FormattedMessage id="app.analysis.sales"/>,
    dataIndex: 'EToday',
    key: 'EToday',
    render: (text) => {
      return numberUnit(text)+'Wh';
    }
  },
];


const SalesCard = memo(
  ({ changeDay, changeMonth,salesDay,salesMonth,salesYear, isActive,
     handleRangePickerChange, loading, selectDate,statusType,dayRank,handleTabChange,currentTabKey}) => (
    <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
      <div className={styles.salesCard}>
        <Tabs
         onChange={handleTabChange}
          tabBarExtraContent={
            currentTabKey==='sales' ?
            (<div className={styles.salesExtraWrap}>
              <div className={styles.salesExtra}>
                <a className={isActive('today')} onClick={() => selectDate('today')}>
                  <FormattedMessage id="app.analysis.all-day" defaultMessage="All Day" />
                </a>
                <a className={isActive('month')} onClick={() => selectDate('month')}>
                  <FormattedMessage id="app.analysis.all-month" defaultMessage="All Month" />
                </a>
                <a className={isActive('year')} onClick={() => selectDate('year')}>
                  <FormattedMessage id="app.analysis.all-year" defaultMessage="All Year" />
                </a>
              </div>
              {
                statusType==='year' ? (
                  <YearPicker
                    onChange={handleRangePickerChange}
                  />) 
                : statusType==='month' ? (
                  <MonthPicker
                    defaultValue={moment()}
                    onChange={handleRangePickerChange}
                  />) 
                : (<DatePicker
                  defaultValue={moment()}
                  onChange={handleRangePickerChange}
                />)
              }
            </div>) : ''
          }
          size="large"
          tabBarStyle={{ marginBottom: 24 }}
        >
          <TabPane
            tab={<FormattedMessage id="app.inverter.group" defaultMessage="group" />}
            key="group"
          >
            <GroupList />
          </TabPane>
          <TabPane
            tab={<FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />}
            key="sales"
          >
            {/* <Row>
              <Col xl={16} lg={12} md={12} sm={24} xs={24}> */}
                <div className={styles.salesBar}>
                  {
                statusType==='today'?(<Area
                height={286}
                title={
                  <FormattedMessage
                    id="app.analysis.sales-trend"
                    defaultMessage="Sales Trend"
                  />
                }
                data={salesDay}
                changeDay={changeDay}
                type='total'
                statusType={statusType}
              />):(<Bar height={286}
                title={
                  <FormattedMessage
                    id="app.analysis.sales-trend"
                    defaultMessage="Sales Trend"
                  />
                }
                data={statusType==='month' ?salesMonth:salesYear}
                statusType={statusType}
                changeMonth={changeMonth}
                type='total' />)
              }
                </div>
              {/* </Col> */}
              {/* <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesRank}>
                  <h4 className={styles.rankingTitle}>
                    <FormattedMessage
                      id="app.analysis.sales-ranking"
                      defaultMessage="Sales Ranking"
                    />
                  </h4>
                  <Table
                    rowKey={record => record.key}
                    size="small"
                    columns={columns}
                    dataSource={dayRank}
                    pagination={{
                      style: { margin: 0,marginTop:'10px' },
                      pageSize: 5,
                    }}
                  />
                </div>
              </Col> */}
            {/* </Row> */}
          </TabPane>
        </Tabs>
      </div>
    </Card>
  )
);

export default SalesCard;
