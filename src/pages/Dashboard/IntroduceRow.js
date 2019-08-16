import React, { memo } from 'react';
import { Row, Col, Icon, Tooltip } from 'antd';
import { FormattedMessage } from 'umi/locale';
import styles from './Analysis.less';
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from 'ant-design-pro/lib/Charts';
import Trend from 'ant-design-pro/lib/Trend';
import numeral from 'numeral';
import Yuan from '@/utils/Yuan';
import {numberUnit} from '@/utils/utils';


const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = memo(({ loading, visitData,handleScroll}) => (
  <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={<FormattedMessage id="app.monitor.power" defaultMessage="power" />}
        avatar={
          <img src={require('@/assets/Energy.png')} className={styles.avatarIcon} alt="power"/>
        }
        total={numberUnit(visitData.CurrPac)+'W'}
        footer={
          <Field
            label={
              <FormattedMessage
                id="app.analysis.time"
                defaultMessage="Conversion Rate"
              />
            }
            value={numberUnit(visitData.Htotal)}
          />
        }
        contentHeight={46}
      >
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={<FormattedMessage id="app.analysis.day-visits" defaultMessage="Daily Visits" />}
        avatar={
          <img src={require('@/assets/power.png')} className={styles.avatarIcon} alt="Power"/>
        }
        total={numberUnit(visitData.EToday)+'Wh'}
        footer={
          <Field
            label={<FormattedMessage id="app.analysis.visits" defaultMessage="Visits" />}
            value={numberUnit(visitData.ETotal)+'Wh'}
          />
        }
        contentHeight={46}
      >
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title={<FormattedMessage id="app.analysis.day-sales" defaultMessage="day Sales" />}
        avatar={
          <img src={require('@/assets/money.png')} className={styles.avatarIcon} alt="Money"/>
        }
        loading={loading}
        total={numberUnit(visitData.EToday*visitData.Price)}
        footer={
          <Field
            label={<FormattedMessage id="app.analysis.total-sales" defaultMessage="total Sales" />}
            value={numberUnit(visitData.ETotal*visitData.Price)}
          />
        }
        contentHeight={46}
      >
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        bordered={false}
        title={
          <FormattedMessage
            id="app.analysis.device-total"
            defaultMessage="Operational Effect"
          />
        }
        avatar={
          <img src={require('@/assets/Device.png')} className={styles.avatarIcon} alt="Plant"/>
        }
        total={numberUnit(visitData.InverterTotalCount)}
        footer={
          <Field
            onClick={handleScroll}
            label={
              <FormattedMessage
                id="app.analysis.operational-effect"
                defaultMessage="Conversion Rate"
              />
            }
            value={numberUnit(visitData.InverterTotalCountOn)}
          />
        }
        contentHeight={46}
      >
      </ChartCard>
    </Col>
  </Row>
));

export default IntroduceRow;
