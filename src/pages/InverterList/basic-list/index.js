import React, { PureComponent } from 'react';
import { FormattedMessage,formatMessage } from 'umi/locale';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import { connect } from 'dva';
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  Progress,
  Button,
  Icon,
  Dropdown,
  Menu,
  Avatar,
  Modal,
  Form,
  DatePicker,
  Select,
  message,
} from 'antd';

import { Result } from 'ant-design-pro';
import {numberUnit} from '@/utils/utils';

import styles from './style.less';
import Online from "@/assets/online.png";
import Offline from "@/assets/offline.png";
import Fault from "@/assets/fault.png";
import Stanby from "@/assets/stanby.png";

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;
const Option = Select.Option;
@connect(({ basicList, loading ,global}) => ({
  MemberAutoID:global.MemberAutoID,
  basicList,
  loading: loading.effects['basicList/fetch'],
}))
@Form.create()
class BasicList extends PureComponent {
  state = {
     visible: false,
     current:{},
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  /**
   *获取所有账号列表
   *
   * @memberof BasicList
   */
  getAccountList=(dispatch,MemberAutoID)=>{
    dispatch({
      type: 'basicList/fetchAccount',
      payload:{
        MemberAutoID:MemberAutoID,
      },
    });
  }
  /**
   *获取机器列表
   *
   * @memberof BasicList
   */
  getList=(dispatch,MemberAutoID=MemberAutoID)=>{
    dispatch({
      type: 'basicList/fetch',
      payload:{
        MemberAutoID:MemberAutoID,
      },
    });
  }

  componentDidMount() {
    const { dispatch,MemberAutoID } = this.props;
    this.getList(dispatch,MemberAutoID);
    this.getAccountList(dispatch,MemberAutoID);
  }
  /**
   *获取不同账号机器
   *
   * @memberof BasicList
   */
  handleChange = value => {
    const { dispatch } = this.props;
    this.getList(dispatch,value);
  };

  //跳转详情
  handleClickRouter=(id)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'basicList/fetchId',
      payload:{
        goodsId:id,
      },
    });
  }


  //显示 弹窗
  showEditModal = (id,name) => {
    this.setState({
      visible: true,
      current: {
        GoodsAutoID:id,
        Name:name,
      },
    });
  };

  //取消 隐藏弹窗
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current:{GoodsAutoID} } = this.state;
    form.validateFields((err, values) => {
      if (err) return;
      dispatch({
        type: 'basicList/submits',
        payload: { 
          GoodsAutoID:GoodsAutoID,
          ...values,
         },
      });
    });
    setTimeout(()=>{
      const { dispatch,basicList:{editStatus},MemberAutoID } = this.props;
      editStatus?message.success(formatMessage({ id: 'app.inverter.successful-operation' }))
      :message.error(formatMessage({ id: 'app.inverter.error-operation' }));
      this.getList(dispatch,MemberAutoID);
    },1000);
    this.setState({
      visible: false,
    });
  };


  render() {
    const {
      basicList: { list,accountList },
      form: { getFieldDecorator },
      loading,
      MemberAutoID,
    } = this.props;
    const { visible,  current } = this.state;


    const Info = ({ title, value, bordered ,status}) => (
      <div className={styles.headerInfoBox}>
        <div className={styles.headerInfoImg}>
        <img src={status==1?Online : status==2 ? Fault :status==3 ? Stanby :Offline} alt="online"/>
        </div>
        <div className={styles.headerInfo}>
          <span>{title}</span>
          <p>{value}</p>
          {bordered && <em />}
        </div>
    </div>
    );
      //筛选机器状态
    // const extraContent = (
    //   <div className={styles.extraContent}>
    //     <RadioGroup defaultValue="all">
    //       <RadioButton value="all"><FormattedMessage id="app.inverter.all" defaultMessage="all" /></RadioButton>
    //       <RadioButton value="normal"><FormattedMessage id="app.inverter.normal" defaultMessage="normal" /></RadioButton>
    //       <RadioButton value="fault"><FormattedMessage id="app.inverter.fault" defaultMessage="fault" /></RadioButton>
    //       <RadioButton value="standby"><FormattedMessage id="app.inverter.standby" defaultMessage="standby" /></RadioButton>
    //       <RadioButton value="offline"><FormattedMessage id="app.inverter.offline" defaultMessage="offline" /></RadioButton>
    //     </RadioGroup>
    //     {/* <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} /> */}
    //   </div>
    // );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      // pageSize: 5,
      // total: 50,
    };

    const ListContent = ({ data: { CurrPac, EToday,Htotal, Light,ETotal } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span><FormattedMessage id="app.inverter.list.power" defaultMessage="power" /></span>
          <p>{CurrPac===''?0:numberUnit(CurrPac)+'W'}</p>
        </div>
        <div className={styles.listContentItem}>
          <span><FormattedMessage id="app.inverter.parameter.e-today" defaultMessage="e-today" /></span>
          <p>{EToday===''?0:numberUnit(EToday)+'Wh'}</p>
        </div>
        <div className={styles.listContentItem}>
          <span><FormattedMessage id="app.inverter.parameter.e-total" defaultMessage="e-total" /></span>
          <p>{Htotal===''?0:numberUnit(ETotal)+'Wh'}</p>
        </div>
        <div className={styles.listContentItem}>
          <span><FormattedMessage id="app.inverter.parameter.h-total" defaultMessage="h-total" /></span>
          <p>{Htotal===''?0:numberUnit(Htotal)}</p>
        </div>

        {/* <div className={styles.listContentItem}>
          <span>开始时间</span>
          <p>{moment(createdAt).format('YYYY-MM-DD')}</p>
        </div> */}
        <div className={styles.listContentItem}>
          <Progress
            type="line"
            showInfo={false}
            percent={100}
            status={
              Light===1 ? 'success' :
              Light===2 ? 'exception':
              Light===3 ? 'active' : 
              'normal'
            }
            strokeWidth={6}
            style={{ width: 100 }}
          />
        </div>
      </div>
    );
      //表单
    const getModalContent =(
      <Form onSubmit={this.handleSubmit}>
          <FormItem label={formatMessage({ id: 'app.inverter.inverter-name' })} {...this.formLayout}>
            {getFieldDecorator('Name', {
              rules: [{ required: true, message: formatMessage({ id: 'app.inverter.inverter-name-input' }) }],
              initialValue: current.Name,
            })(<Input  />)}
          </FormItem>
        </Form>
    );

    return (
      <React.Fragment>
        <div style={{ paddingBottom: '6px' }}>
          <Select
            showSearch
            style={{ width: 200 }}
            defaultValue={MemberAutoID}
            placeholder="Select a person"
            optionFilterProp="children"
            onChange={this.handleChange}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {
              accountList.map(item=><Option value={item.AutoID} key={item.AutoID}>{item.MemberID}</Option> )
            }
          </Select>
        </div>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={6} xs={24}>
                <Info title={<FormattedMessage id="app.inverter.normal" defaultMessage="normal" />} status='1' value={list.normal} bordered />
              </Col>
              <Col sm={6} xs={24}>
                <Info title={<FormattedMessage id="app.inverter.fault" defaultMessage="fault" />} status='2' value={list.fault} bordered />
              </Col>
              <Col sm={6} xs={24}>
                <Info title={<FormattedMessage id="app.inverter.standby" defaultMessage="standby" />} status='3' value={list.standby} bordered />
              </Col>
              <Col sm={6} xs={24}>
                <Info title={<FormattedMessage id="app.inverter.offline" defaultMessage="offline" />} status='4' value={list.offline} />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title={
              <FormattedMessage id="app.inverter.machine-list" defaultMessage="machine-list" />
            }
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            // extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list.AllInverterList}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a
                      onClick={e => {
                        e.preventDefault();
                        this.showEditModal(item.AutoID,item.GoodsName);
                      }}
                    >
                      <FormattedMessage id="app.inverter.edit" defaultMessage="edit" />
                    </a>,
                  ]}
                >
                  <List.Item.Meta
                    // avatar={<Avatar src={item.logo} shape="square" size="large" />}
                    title={<a style={{color:'#1890ff'}} onClick={this.handleClickRouter.bind(this,item.GoodsID)}>{item.GoodsName}</a>}
                    //description={item.subDescription}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
        <Modal
          title={formatMessage({ id: 'app.inverter.edit-group' })}
          className={styles.standardListForm}
          width={500}
          destroyOnClose
          visible={visible}
          onOk={this.handleSubmit}
           onCancel={this.handleCancel}
        >
          {getModalContent}
        </Modal>
      </React.Fragment>
    );
  }
}

export default BasicList;
