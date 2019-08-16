import React, { memo } from 'react';
import { Row, Col, Card, Tabs, DatePicker } from 'antd';
import { FormattedMessage, formatMessage } from 'umi/locale';
import moment from 'moment';
import YearPicker from '@/components/YearPicker/YearPicker';
import numeral from 'numeral';
import styles from './style.less';
import Area from '@/components/Charts/Area';
import Bar from '@/components/Charts/Bar';

const { RangePicker,MonthPicker } = DatePicker;
const { TabPane } = Tabs;


const SalesCard = memo(
  ({handleTabChange,changeDay,changeMonth,yearLineSum,monthLineSum,salesYear,salesMonth,
    dayLineSum, salesDay, isActive, handleRangePickerChange, loading, selectDate,statusType,screenHeight}) => (
    <Card  bordered={false} bodyStyle={{ padding: 0 }}>
      <div className={styles.salesCard}>
        <Tabs 
          loading={loading}
          onChange={handleTabChange}
          tabBarExtraContent={
            <div className={styles.salesExtraWrap}>
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
            </div>
          }
          size="large"
          tabBarStyle={{ marginBottom: 24 }}
        >
          <TabPane
            tab={<FormattedMessage id="app.inverter.total" defaultMessage="Sales" />}
            key="group"
          >
            <div className={styles.salesBar}>
              {
                statusType==='today'?(<Area
                
                height={screenHeight}
                title={
                  <FormattedMessage
                    id="app.analysis.sales-trend"
                    defaultMessage="Sales Trend"
                  />
                }
                changeDay={changeDay}
                data={salesDay}
                type='total'
              />):(<Bar height={screenHeight}
                title={
                  <FormattedMessage
                    id="app.analysis.sales-trend"
                    defaultMessage="Sales Trend"
                  />
                }
                data={statusType==='month' ?monthLineSum:yearLineSum}
                statusType={statusType}
                changeMonth={changeMonth}
                type='total' />)
              }
            </div>
          </TabPane>
          <TabPane
            tab={<FormattedMessage id="app.inverter.single" defaultMessage="income" />}
            key="single"
          >
            <div className={styles.salesBar}>
            {
                statusType==='today'?(<Area
                height={screenHeight}
                title={
                  <FormattedMessage
                    id="app.analysis.sales-trend"
                    defaultMessage="Sales Trend"
                  />
                }
                changeDay={changeDay}
                data={dayLineSum}
              />):(<Bar height={screenHeight}
                title={
                  <FormattedMessage
                    id="app.analysis.sales-trend"
                    defaultMessage="Sales Trend"
                  />
                }
                statusType={statusType}
                changeMonth={changeMonth}
                data={statusType==='month' ?salesMonth:salesYear}
                 />)
              }
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Card>
  )
);

export default SalesCard;
