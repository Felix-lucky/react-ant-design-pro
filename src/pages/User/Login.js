import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import { Form, Input, Button, Checkbox, Alert } from 'antd';
import styles from './Login.less';

const FormItem = Form.Item;
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
@Form.create()
class LoginBox extends React.Component {
  state = {
    type: '1',
    autoLogin: false,
  };
  handleSubmit = e => {
    e.preventDefault();
    const { type } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'login/login',
          payload: {
            ...values,
            type,
          },
        });
      }
    });
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { getFieldDecorator } = this.props.form;
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.container_left} />
        <div className={styles.container_right}>
          <h1 className={styles.title}>
            <FormattedMessage id="app.login.login" />
          </h1>
          {login.status === 'error' &&
            login.type === '1' &&
            !submitting &&
            this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('MemberID', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.userName.required' }),
                  },
                ],
              })(
                <Input
                  type="text"
                  placeholder={formatMessage({ id: 'app.login.userName' })}
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('Password', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.password.required' }),
                  },
                ],
              })(
                <Input
                  type="password"
                  placeholder={formatMessage({ id: 'app.login.password' })}
                  onPressEnter={e => {
                    this.handleSubmit(e);
                  }}
                />
              )}
            </FormItem>
            <div className={styles.forgot}>
              <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>
                <FormattedMessage id="app.login.remember-me" />
              </Checkbox>
              <Link to="/user/forgot-password">
                <FormattedMessage id="app.login.forgot-password" />
              </Link>
            </div>
            <FormItem>
              <Button
                loading={submitting}
                size="large"
                className={styles.submit}
                type="primary"
                htmlType="submit"
              >
                <FormattedMessage id="app.login.login" />
              </Button>
            </FormItem>
            <Link className={styles.register} to="/user/register">
              <FormattedMessage id="app.login.signup" />
            </Link>
          </Form>
        </div>
      </div>
    );
  }
}

export default LoginBox;
