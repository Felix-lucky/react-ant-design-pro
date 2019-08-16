import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import moment from 'moment';
import Link from 'umi/link';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';

import styles from './ForgotPassword.less';

const FormItem = Form.Item;

@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/forgot'],
}))
class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'register/forgot',
          payload: {
            ...values,
          },
        });
      }
    });
  };
  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.main}>
        <h1>
          <FormattedMessage id="app.login.forgot-password" />
        </h1>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('userName', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.userName.required' }),
                },
              ],
            })(<Input type="text" placeholder={formatMessage({ id: 'app.login.userName' })} />)}
          </FormItem>
          <FormItem>
            <Button
              loading={submitting}
              size="large"
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              <FormattedMessage id="app.forgor-password.email" />
            </Button>
          </FormItem>
          <Link className={styles.login} to="/user/login">
            <FormattedMessage id="app.register-result.back-home" />
          </Link>
        </Form>
      </div>
    );
  }
}

export default Form.create()(ForgotPassword);
