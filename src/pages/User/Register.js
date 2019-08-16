import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import moment from 'moment';
import Link from 'umi/link';
import router from 'umi/router';
import { connect } from 'dva';
import { Form, Input, Button, Select } from 'antd';
import styles from './Register.less';

const FormItem = Form.Item;
const { Option } = Select;
const Timezone=-(moment().zone()/60);
const timezoneData= [['17', 'form.timezone_17', '-10'], ['16', 'form.timezone_16', '-8'], ['15', 'form.timezone_15', '-6'], ['14', 'form.timezone_14', '-5'], ['13', 'form.timezone_13', '-4'], ['12', 'form.timezone_12', '-3'], ['11', 'form.timezone_11', '0'], ['10', 'form.timezone_10', '1'], ['9', 'form.timezone_09', '2'], ['8', 'form.timezone_08', '3'], ['7', 'form.timezone_07', '3.5'], ['18', 'form.timezone_18', '4'], ['6', 'form.timezone_06', '5.5'], ['5', 'form.timezone_05', '7'], ['4', 'form.timezone_04', '8'], ['3', 'form.timezone_03', '9'], ['2', 'form.timezone_02', '10'], ['1', 'form.timezone_01', '12']];
@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/submit'],
}))
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Timezone: [
        ['17', 'form.timezone_17', '-10'],
        ['16', 'form.timezone_16', '-8'],
        ['15', 'form.timezone_15', '-6'],
        ['14', 'form.timezone_14', '-5'],
        ['13', 'form.timezone_13', '-4'],
        ['12', 'form.timezone_12', '-3'],
        ['11', 'form.timezone_11', '0'],
        ['10', 'form.timezone_10', '1'],
        ['9', 'form.timezone_09', '2'],
        ['8', 'form.timezone_08', '3'],
        ['7', 'form.timezone_07', '3.5'],
        ['18', 'form.timezone_18', '4'],
        ['6', 'form.timezone_06', '5.5'],
        ['5', 'form.timezone_05', '7'],
        ['4', 'form.timezone_04', '8'],
        ['3', 'form.timezone_03', '9'],
        ['2', 'form.timezone_02', '10'],
        ['1', 'form.timezone_01', '12'],
      ],
    };
  }
  //验证两次密码是否相等
  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
    }
  };
  // 提交
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'register/submit',
          payload: {
            ...values,
            // type,
          },
        });
      }
    });
  };
  //获取当前时区列表
  getTimezone = () => {
    timezoneData.map((v, k) => {
      if (v[2] == Timezone) {
        this.props.form.setFieldsValue({
          timezone: v[0],
        });
      }
    });
  };
  //生命周期
  componentDidMount() {
    this.getTimezone();
  }
  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.main}>
        <h1>
          <FormattedMessage id="app.register.register" />
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
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.confirm-password.required' }),
                },
              ],
            })(
              <Input
                type="password"
                placeholder={formatMessage({ id: 'form.password.placeholder' })}
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.confirm-password.required' }),
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(
              <Input
                type="password"
                placeholder={formatMessage({ id: 'form.confirm-password.placeholder' })}
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('mail', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.email.required' }),
                },
                {
                  type: 'email',
                  message: formatMessage({ id: 'validation.email.wrong-format' }),
                },
              ],
            })(<Input placeholder={formatMessage({ id: 'form.email.placeholder' })} />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('timezone')(
              <Select>
                {this.state.Timezone.map((v, k) => {
                  return (
                    <Option value={v[0]} key={v[2]}>
                      <FormattedMessage id={v[1]} />
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem>
            <Button
              loading={submitting}
              size="large"
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              <FormattedMessage id="app.register.register" />
            </Button>
          </FormItem>
          <Link className={styles.login} to="/user/login">
            <FormattedMessage id="app.register.sign-in" />
          </Link>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Register);
