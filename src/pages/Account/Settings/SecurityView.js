import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Button } from 'antd';
import styles from './BaseView.less';


const FormItem = Form.Item;

@connect(({ account,loading,global }) => ({
  MemberAutoID:global.MemberAutoID,
  alterStatus: account.alterStatus,
  loading: loading.effects['account/alter'],
}))
@Form.create()

class SecurityView extends Component {

  //确认两次输入密码
  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('new1Pssword')) {
      callback(formatMessage({ id: 'app.settings.basic.password-two' }));
    } else {
      callback();
    }
  };
  //提交
  handleSubmit=(e)=>{
    e.preventDefault();
    const {form,dispatch,MemberAutoID}=this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let params={
          MemberAutoID:MemberAutoID,
          old_PW:values.oldPassword,
          new_PW:values.new2Pssword,
        }
        dispatch({
          type: 'account/alter',
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
      <div className={styles.baseView} >
        <div className={styles.left}>
        <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
        <FormItem label={formatMessage({ id: 'app.settings.old.password' })}>
              {getFieldDecorator('oldPassword', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.password-message' }, {}),
                  },
                ],
              })(<Input type="password" />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.new1.password' })}>
              {getFieldDecorator('new1Pssword', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.password-message' }, {}),
                  },
                ],
              })(<Input type="password" />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.new2.password' })}>
              {getFieldDecorator('new2Pssword', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.password-message' }, {}),
                  },
                  {
                    validator: this.checkConfirm,
                  },
                ],
              })(<Input type="password" />)}
            </FormItem>
            <Button type="primary" htmlType="submit" >
              <FormattedMessage
                id="app.settings.password.update"
                defaultMessage="password"
              />
            </Button>
        </Form>
        </div>
      </div>
    );
  }
}

export default SecurityView;
