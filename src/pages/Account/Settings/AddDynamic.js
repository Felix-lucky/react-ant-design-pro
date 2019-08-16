import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Icon, Button, } from 'antd';

import styles from './AddDynamic.less';

  let id = 1;
  
  class DynamicFieldSet extends React.Component {
    remove = (k) => {
      const { form } = this.props;
      const keys = form.getFieldValue('keys');
      if (keys.length === 1) {
        return;
      }
  
      form.setFieldsValue({
        keys: keys.filter(key => key !== k),
      });
    }
  
    add = () => {
      const { form } = this.props;
      const keys = form.getFieldValue('keys');
      const nextKeys = keys.concat(id++);
      form.setFieldsValue({
        keys: nextKeys,
      });
    }
  
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          const { keys, names } = values;
          console.log('Received values of form: ', values);
          console.log('Merged values:', keys.map(key => names[key]));
        }
      });
    }
  
    render() {
      const { getFieldDecorator, getFieldValue } = this.props.form;
      getFieldDecorator('keys', { initialValue: [0] });
      const keys = getFieldValue('keys');
      const formItems = keys.map((k, index) => (
        <Form.Item
          required={false}
          key={k}
        >
          {getFieldDecorator(`emails[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: formatMessage({ id: 'app.settings.basic.email-message' }),
            }],
          })(
            <Input type='email' />
          )}
          {keys.length > 1 ? (
            <Icon
              className={styles.dynamic_delete_button}
              type="minus-circle-o"
              onClick={() => this.remove(k)}
            />
          ) : null}
        </Form.Item>
      ));
      return (
        <div onSubmit={this.handleSubmit}>
          {formItems}
          <Form.Item >
            <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
              <Icon type="plus" /> <FormattedMessage id="app.settings.basic.add-email" />
            </Button>
          </Form.Item>
        </div>
      );
    }
  }
  
  const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(DynamicFieldSet);

  export default WrappedDynamicFieldSet;