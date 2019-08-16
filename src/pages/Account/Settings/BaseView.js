import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { is, fromJS} from 'immutable';
import { Form, Input, Upload, Select, Button ,Icon } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
import { object } from 'prop-types';
// import { getTimeDistance } from '@/utils/utils';
const FormItem = Form.Item;
const { Option } = Select;
const timezoneData=[['17', 'form.timezone_17', '-10'], ['16', 'form.timezone_16', '-8'], ['15', 'form.timezone_15', '-6'], ['14', 'form.timezone_14', '-5'], ['13', 'form.timezone_13', '-4'], ['12', 'form.timezone_12', '-3'], ['11', 'form.timezone_11', '0'], ['10', 'form.timezone_10', '1'], ['9', 'form.timezone_09', '2'], ['8', 'form.timezone_08', '3'], ['7', 'form.timezone_07', '3.5'], ['18', 'form.timezone_18', '4'], ['6', 'form.timezone_06', '5.5'], ['5', 'form.timezone_05', '7'], ['4', 'form.timezone_04', '8'], ['3', 'form.timezone_03', '9'], ['2', 'form.timezone_02', '10'], ['1', 'form.timezone_01', '12']];
const MemberAutoID=localStorage.getItem('MemberAutoID');

// const validatorGeographic = (rule, value, callback) => {
//   const { province, city } = value;
//   if (!province.key) {
//     callback('Please input your province!');
//   }
//   if (!city.key) {
//     callback('Please input your city!');
//   }
//   callback();
// };

// const validatorPhone = (rule, value, callback) => {
//   const values = value.split('-');
//   if (!values[0]) {
//     callback('Please input your area code!');
//   }
//   if (!values[1]) {
//     callback('Please input your phone number!');
//   }
//   callback();
// };
@connect(({ account,loading,global }) => ({
  MemberAutoID:global.MemberAutoID,
  accountInfo: account.accountInfo,
  updateStatus:account.updateStatus,
  loading: loading.effects['account/fetch'],
}))
@Form.create()


class BaseView extends Component {
  constructor(props){
    super(props);
    this.state={
      id:0,
      keys:[0],
      result:{},
    }
  }
//查询基本信息
getResult=()=>{
  return new Promise((resolve, reject)=>{
    const { dispatch,MemberAutoID } = this.props;
    dispatch({
      type: 'account/fetch',
      payload: {
        MemberAutoID:MemberAutoID,
      },
    });
    this.__timeout=setTimeout(()=>{
      resolve();
    },1500);
  });
}
getData=()=>{
  this.getResult().then(()=>{
      const {form ,accountInfo}=this.props;
      if(JSON.stringify(accountInfo)!=="{}"){
      Object.keys(form.getFieldsValue()).forEach(key => {
        form.setFieldsValue(this.state.result);
      });
    }
  });
}
componentDidMount(){
  this.getData();
}
componentWillUnmount(){
  clearInterval(this.__timeout);
}
//生命周期 nextProps, nextState发生改变执行
  shouldComponentUpdate(nextProps, nextState){
    const { form } = this.props;
    let accountInfo=nextProps.accountInfo;
    if(!is(fromJS(this.props), fromJS(nextProps))){
      if(JSON.stringify(accountInfo)!=="{}"){
        let emails=accountInfo.Email;
        let newEmails=emails.filter(item=>item!==''&&item!==null);
        let newEmailsLen=newEmails.length;
        let newKeys=[];
          const obj = {
          Emails:newEmails,
          UserName:accountInfo.UserName,
          Price:accountInfo.Price,
        };
        if(newEmailsLen>0){
          for(let i=0;i<newEmailsLen;i++){
            newKeys[i]=i;
          };
          this.setState({
            keys:newKeys,
            result:obj,
          });
        };
      };
    }
    return true;
  }
  //删除多余邮箱
  remove = (k) => {
    const { keys } = this.state;
    if (keys.length === 1) {
      return;
    }
    this.setState({
      keys: keys.filter(key => key !== k),
    });
  }
//增加多个邮箱
  add = () => {
    let { keys,id } = this.state;
    id=keys.length-1+1;
    const nextKeys=keys.concat(id);
    this.setState({
      id:id,
      keys:nextKeys,
    });
  }
  //更新资料
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch ,MemberAutoID} = this.props;
        let emails=values.Emails;
        let params={
          MemberEmail:emails[0]||'',
          MemberEmail2:emails[1]||'',
          MemberEmail3:emails[2]||'',
          MemberEmail4:emails[3]||'',
          MemberEmail5:emails[4]||'',
          UserName:values.UserName,
          Price:values.Price,
          MemberAutoID:MemberAutoID,
        }
      dispatch({
        type: 'account/update',
        payload: {
          ...params,
        },
      });
      this.getData();
      }
    });
  }
  //邮箱验证
  validatorEamil=(rule, value, callback)=>{
    let isTrue=/^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;
    if (!isTrue.test(value)) {
        callback(formatMessage({ id: 'app.settings.basic.enter-email' }));
    }
    callback();
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { keys }=this.state;
    return (
      <div className={styles.baseView} >
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
            {
              keys.map((k, index) => (
                <FormItem
                label={index === 0 ? formatMessage({ id: 'app.settings.basic.email' }) : ''}
                  required={false}
                  key={k}
                >
                  {getFieldDecorator(`Emails[${k}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                      required: true,
                      whitespace: true,
                      message: formatMessage({ id: 'app.settings.basic.email-message' }),
                      validator:this.validatorEamil,
                    }],
                  })(
                    <Input />
                  )}
                  {keys.length > 1 ? (
                    <Icon
                      className={styles.dynamic_delete_button}
                      type="minus-circle-o"
                      onClick={() => this.remove(k)}
                    />
                  ) : null}
                </FormItem>
                ))
            }
            <FormItem >
              <Button disabled={keys.length>4?true:false} type="dashed" onClick={this.add} >
                <Icon type="plus" /> <FormattedMessage id="app.settings.basic.add-email" />
              </Button>
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.nickname' })}>
              {getFieldDecorator('UserName', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.nickname-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.profile' })}>
              <div className={styles.priceBox}>
              {getFieldDecorator('Price', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'app.settings.basic.profile-message' }, {}),
                    },
                  ],
                })(
                  <Input style={{width:100,marginRight:8}} />
                )}
                  <Select defaultValue="1" style={{ maxWidth: 180 ,marginRight:8}}>
                      <Option value="1">EUR</Option>
                      <Option value="2">USD</Option>
                      <Option value="3">CNY</Option>
                      <Option value="4">MXN</Option>
                  </Select>
                  <FormattedMessage id="app.settings.money" />
               </div>
            </FormItem>
            {/* <FormItem label={formatMessage({ id: 'app.settings.basic.address' })}>
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.address-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem> */}
            {/* <FormItem label={formatMessage({ id: 'app.settings.basic.country' })}>
              {getFieldDecorator('timezone', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.country-message' }, {}),
                  },
                ],
              })(
                <Select>
                  {
                    timezoneData.map((v,k)=>{
                      return <Option value={v[0]} key={v[2]} ><FormattedMessage id={v[1]} /></Option>
                    })
                  }
                </Select>
              )}
            </FormItem> */}
            
            {/* <FormItem label={formatMessage({ id: 'app.settings.basic.phone' })}>
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.phone-message' }, {}),
                  },
                  { validator: validatorPhone },
                ],
              })(<PhoneView />)}
            </FormItem> */}
            <Button type="primary" htmlType="submit" >
              <FormattedMessage
                id="app.settings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default BaseView;
