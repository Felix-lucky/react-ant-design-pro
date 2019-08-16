import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Button } from 'antd';
import styles from './BaseView.less';


const FormItem = Form.Item;
@connect(({ account,loading,global }) => ({
  MemberAutoID:global.MemberAutoID,
  bindStatus: account.bindStatus,
  loading: loading.effects['account/bind'],
}))
@Form.create()

class BindingView extends Component {
   //提交
   handleSubmit=(e)=>{
    e.preventDefault();
    const {form,dispatch,MemberAutoID}=this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let params={
          MemberAutoID:MemberAutoID,
          SubAccount:values.nickName,
          MemberPW:values.password,
        }
        dispatch({
          type: 'account/bind',
          payload: {
            ...params,
          },
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.baseView}  >
        <div className={styles.left}>
        <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
        <FormItem label={formatMessage({ id: 'app.settings.basic.nickname' })}>
              {getFieldDecorator('nickName', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.nickname-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.password' })}>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.password-message' }, {}),
                  },
                ],
              })(<Input type="password" />)}
            </FormItem>
            <Button type="primary" htmlType="submit" >
              <FormattedMessage
                id="app.settings.bind.account"
                defaultMessage="bind"
              />
            </Button>
        </Form>
        </div>
      </div>
    );
  }
}

export default BindingView;
