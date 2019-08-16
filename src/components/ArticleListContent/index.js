import React from 'react';
import moment from 'moment';
import { Avatar } from 'antd';
import { FormattedMessage, formatMessage } from 'umi/locale';
import styles from './index.less';

const ArticleListContent = ({ data: { ErrorCode, Time, MemberID } }) => (
  <div className={styles.listContent}>
    <div className={styles.description}>
      <FormattedMessage id="app.logs.alarm-name" />：{ErrorCode&&formatMessage({ id: `app.logs.msg${ErrorCode}` })}
    </div>
    {/* <div className={styles.description}>
      <FormattedMessage id="app.logs.alarm-reason" />：{alarmReason}
    </div>
    <div className={styles.description}>
      <FormattedMessage id="app.logs.suggestion" />：{suggestion}
    </div> */}
    <div className={styles.extra}>
      <a>{MemberID}</a>
      <em>{Time}</em>
    </div>
  </div>
);

export default ArticleListContent;
