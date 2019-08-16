import React, { memo } from 'react';
import { Card, Radio } from 'antd';
import { FormattedMessage } from 'umi/locale';
import styles from './Analysis.less';
import { Pie } from 'ant-design-pro/lib/Charts';
import Yuan from '@/utils/Yuan';

const colors=['#00A12D ','#FF6433','#F7BC1F','#868686'];
const ProportionSales = memo(
  ({ loading, salesPieData }) => (
    <Card
      loading={loading}
      className={styles.salesCard}
      bordered={false}
      title={
        <FormattedMessage
          id="app.analysis.the-proportion-of-sales"
          defaultMessage="The Proportion of Sales"
        />
      }
      bodyStyle={{ padding: 24 }}
      style={{ marginTop: 24 }}
    >
      {/* <h4 style={{ marginTop: 10, marginBottom: 32 }}>
        <FormattedMessage id="app.analysis.device-total" defaultMessage="Sales" />
      </h4> */}
      <Pie
        hasLegend
        subTitle={<FormattedMessage id="app.analysis.device-total" defaultMessage="Sales" />}
        total={() => salesPieData.reduce((pre, now) => now.y + pre, 0)}
        data={salesPieData}
        valueFormat={value => value}
        height={270}
        lineWidth={0}
        colors={colors}
        style={{ padding: '8px 0' }}
      />
    </Card>
  )
);

export default ProportionSales;
