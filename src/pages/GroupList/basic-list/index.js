import React, { PureComponent } from 'react';
import { FormattedMessage,formatMessage } from 'umi/locale';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import { connect } from 'dva';
import {List,Card,Row,Col,Radio,Input,Progress,Button,Icon,Dropdown,Menu,Transfer,
  Avatar,Modal,Form,DatePicker,Select,Steps,Switch ,message} from 'antd';
import {numberUnit} from '@/utils/utils';
import { Result } from 'ant-design-pro';
import router from 'umi/router';
import styles from './style.less';

import Online from "@/assets/online.png";
import Offline from "@/assets/offline.png";
import Fault from "@/assets/fault.png";
import Stanby from "@/assets/stanby.png";

message.config({
  top: 100,
  duration: 2,
  maxCount: 3,
});

const { Step } = Steps;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;
const Option = Select.Option;
@connect(({ groupList, loading,global,formGroup}) => ({
  MemberAutoID:global.MemberAutoID,
  groupList,
  formGroup,
  loading: loading.effects['groupList/fetch'],
}))
@Form.create()
class BasicList extends PureComponent {
  state = { 
    visible: false,
    currStatus:false,
    targetKeys: [],
    currentSteps:0,
    form:{},
    currentId:'',
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  /**
   *获取列表
   *
   * @memberof BasicList
   */
  getList =(dispatch,MemberAutoID=MemberAutoID)=>{
    dispatch({
      type: 'groupList/fetch',
      payload:{
        MemberAutoID:MemberAutoID,
      },
    });
  }

  /**
   *获取所有账号列表
   *
   * @memberof BasicList
   */
  getAccountList=(dispatch,MemberAutoID)=>{
    dispatch({
      type: 'groupList/fetchAccount',
      payload:{
        MemberAutoID:MemberAutoID,
      },
    });
  }
  componentDidMount() {
    const { dispatch,MemberAutoID,location:{ query }} = this.props;
    if(JSON.stringify(query)!=='{}'){
      this.getList(dispatch,query.autoId);
    }else{
      this.getList(dispatch,MemberAutoID);
    }
    this.getAccountList(dispatch,MemberAutoID);
  }

  handleChange = value => {
    const { dispatch} = this.props;
    this.getList(dispatch,value);
  };

  //跳转群组详情页
  handleClickRouter=(id)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'groupList/fetchId',
      payload:{
        id:id,
      },
    });
  }
  //机器列表
  getInverterList=(dispatch,MemberAutoID)=>{
    dispatch({
      type: 'formGroup/accountInverter',
      payload:{
        MemberAutoID:MemberAutoID,
      },
    });
  }

  //添加群组
  showModal = () => {
    const { dispatch} = this.props;
    dispatch({
      type: 'formGroup/clear',
    });
    this.setState({
      visible: true,
      current: undefined,
      currStatus:false,
    });
  };

  //编辑群组
  showEditModal = id => {
    const { dispatch} = this.props;
    dispatch({
      type: 'formGroup/getGroup',
      payload:{
        GroupAutoID:id,
      },
    });
    this.setState({
      visible: true,
      currStatus:true,
      currentId:id,
    });
  };

  //验证是否数字
  validatorNumber=(rule, value, callback)=>{
    let regPos = /^\d+(\.\d+)?$/; //非负浮点数
    let regNeg = /^(([0-9]+\.[0-9]*[0-9][0-9]*)|([0-9]*[0-9][0-9]*\.[0-9]+)|([0-9]*[0-9][0-9]*))$/; //负浮点数
    if(value!==''){
      if (!(regPos.test(value)) || !(regNeg.test(value))) {
        callback(<FormattedMessage id="app.inverter.number-input" />)
      };
    }
    callback();
  }

  //提交表单
  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form,MemberAutoID, formGroup: {getCurrentGroup},} = this.props;
    const { current,currentSteps } = this.state;
    const targetKeys=getCurrentGroup.inverterlist;
    const newTargetKeys=[];
    if(targetKeys.length>0){
      for(let i=0;i<targetKeys.length;i++){
        newTargetKeys.push(targetKeys[i].AutoId);
      }
    }
    setTimeout(() => this.addBtn.blur(), 0);
    form.validateFields((err, values) => {
      if (err) return;
      values.StartDate=moment(values.StartDate).format("YYYY-MM-DD");
      (values.Description===undefined) && (values.Description='');
      (values.MPPT===undefined) && (values.MPPT=0);
      (values.MPPT===true)&& (values.MPPT=1);
      this.setState({
        form:values,
        currentSteps:1,
        targetKeys:newTargetKeys,
      });
      this.getInverterList(dispatch,MemberAutoID);
    });
  };

  //删除群组
  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'formGroup/deleteGroup',
      payload: { 
        GroupAutoID:id
       },
    });
    
    setTimeout(()=>{
      const { formGroup: { addStatus } }=this.props;
      addStatus?message.success(formatMessage({ id: 'app.inverter.successful-operation' }))
      :message.error(formatMessage({ id: 'app.inverter.error-operation' }));
      if(addStatus){
        if(JSON.stringify(query)!=='{}'){
          this.getList(dispatch,query.autoId);
        }else{
          this.getList(dispatch,MemberAutoID);
        }
      }
    },1000);
  };

  filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

  handleChangeTransfer = targetKeys => {
    this.setState({ targetKeys });
  };

  //第二步提交
  handleTransfer=()=>{
    const { currentSteps,form,targetKeys,currStatus,currentId} = this.state;
    const { dispatch,MemberAutoID} = this.props;
    const param1={
        ...form,
        Inverter:targetKeys,
        MemberAutoID:MemberAutoID,
      };
      const param2={
        ...form,
        Inverter:targetKeys,
        MemberAutoID:MemberAutoID,
        GroupAutoID:currentId,
      };
      if(currStatus){
        dispatch({
          type: 'formGroup/editGroup',
          payload:param2,
        });
      }else{
        dispatch({
          type: 'formGroup/addGroup',
          payload: param1,
        });
      }
    this.setState({
      currentSteps:2,
    });
  }

  //取消隐藏弹窗 第三步
  handleDone = () => {
    const { dispatch,MemberAutoID,location:{ query }, formGroup: {addStatus} } = this.props;
    if(addStatus){
      if(JSON.stringify(query)!=='{}'){
        this.getList(dispatch,query.autoId);
      }else{
        this.getList(dispatch,MemberAutoID);
      }
    }
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false,
      currentSteps:0,
    });
  };

  //取消隐藏弹窗
  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false,
      currentSteps:0,
    });
  };

  render() {
    const {
      groupList: { list,accountList,},
      formGroup:{ getCurrentGroup,inverterList,addStatus},
      loading,
      form: { getFieldDecorator },
      MemberAutoID,
      location:{ query },
    } = this.props;
    const { visible, current = {},currStatus,currentSteps,targetKeys} = this.state;
    const showDelete = (id) => {
        Modal.confirm({
          title: formatMessage({ id: 'app.inverter.model-title' }),
          content: formatMessage({ id: 'app.inverter.model-content' }),
          okText: formatMessage({ id: 'app.inverter.ok' }),
          cancelText: formatMessage({ id: 'app.inverter.cancel' }),
          onOk: () => this.deleteItem(id),
        });
    };
    const modalFooter = currentSteps===1? { onOk: this.handleTransfer, onCancel: this.handleCancel }:
    currentSteps===2? {  footer:null, onCancel: this.handleCancel }:
    {  onOk: this.handleSubmit, onCancel: this.handleCancel }
    const Info = ({ title, value, bordered ,status}) => (
      <div className={styles.headerInfoBox}>
        <div className={styles.headerInfoImg}>
        <img src={status==1?Online : status==2 ? Fault :status==3 ? Stanby : Offline} alt="online"/>
        </div>
        <div className={styles.headerInfo}>
          <span>{title}</span>
          <p>{value}</p>
          {bordered && <em />}
        </div>
      </div>
    );
    /**筛选状态 */
    // const extraContent = (
    //   <div className={styles.extraContent}>
    //     <RadioGroup defaultValue="all">
    //       <RadioButton value="all"><FormattedMessage id="app.inverter.all" defaultMessage="all" /></RadioButton>
    //       <RadioButton value="normal"><FormattedMessage id="app.inverter.normal" defaultMessage="normal" /></RadioButton>
    //       <RadioButton value="fault"><FormattedMessage id="app.inverter.fault" defaultMessage="fault" /></RadioButton>
    //       <RadioButton value="standby"><FormattedMessage id="app.inverter.standby" defaultMessage="standby" /></RadioButton>
    //       <RadioButton value="offline"><FormattedMessage id="app.inverter.offline" defaultMessage="offline" /></RadioButton>
    //     </RadioGroup>
    //   </div>
    // );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      // pageSize: 5,
      // total: 50,
    };

    const ListContent = ({ data: { EToday, effect,CurrPac, GreenPercent, Light,CreateDate } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span><FormattedMessage id="app.inverter.parameter.e-today" defaultMessage="e-today" /></span>
          <p>{numberUnit(EToday)+'Wh'}</p>
        </div>
        <div className={styles.listContentItem}>
          <span><FormattedMessage id="app.inverter.list.power" defaultMessage="power" /></span>
          <p>{numberUnit(CurrPac)+'W'}</p>
        </div>
        <div className={styles.listContentItem}>
          <span><FormattedMessage id="app.inverter.efficiency" defaultMessage="efficiency" /></span>
          <p>{numberUnit(effect)}</p>
        </div>
        {/* <div className={styles.listContentItem}>
          <span>RA</span>
          <p>90</p>
        </div> */}
        <div className={styles.listContentItem}>
          <span><FormattedMessage id="app.inverter.start-time" defaultMessage="start-time" /></span>
          <p>{moment(CreateDate).format('YYYY-MM-DD')}</p>
        </div>
        <div className={styles.listContentItem}>
          <Progress
            type="circle"
            percent={GreenPercent}
            status={
              Light===1 ? 'success' :
              Light===2 ? 'exception':
              Light===3 ? 'active' : 
              'normal'
            }
            strokeWidth={6}
            width={65}
            style={{ width: '65px' }}
          />
        </div>
      </div>
    );

    //群组表单
    const groupForm=(
      <Form onSubmit={this.handleSubmit}>
          <FormItem label={formatMessage({ id: 'app.inverter.group-name' })} {...this.formLayout}>
            {getFieldDecorator('GroupName', {
              rules: [{ required: true, message: formatMessage({ id: 'app.inverter.group-name-input' }) }],
              initialValue:getCurrentGroup.Info.GoodsTypeName,
            })(<Input placeholder={formatMessage({ id: 'app.inverter.group-name-input' })} />)}
          </FormItem>
          <FormItem label={formatMessage({ id: 'app.inverter.group-time' })} {...this.formLayout}>
            {getFieldDecorator('StartDate', {
              rules: [{ required: true, message: formatMessage({ id: 'app.inverter.group-time-select' }) }],
              initialValue: getCurrentGroup.Info.CreateDate ? moment(getCurrentGroup.Info.CreateDate) : null,
            })(
              <DatePicker
                format="YYYY-MM-DD"
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
          <FormItem label={formatMessage({ id: 'app.inverter.group-kwp' })} {...this.formLayout}>
            {getFieldDecorator('kwp', {
              rules: [
                {required: true, message: formatMessage({ id: 'app.inverter.group-kwp-input' })},
                {validator:this.validatorNumber}
                ],
              initialValue: getCurrentGroup.Info.GoodsKWP,
            })(<Input placeholder={formatMessage({ id: 'app.inverter.group-kwp-input' })} />)}
          </FormItem>
          <FormItem label={formatMessage({ id: 'app.inverter.group-base' })} {...this.formLayout}>
            {getFieldDecorator('TotalBase', {
              rules: [{ required: true, message: formatMessage({ id: 'app.inverter.group-base-input' }) },
              {validator:this.validatorNumber}
              ],
              initialValue: getCurrentGroup.Info.Goods_base_ETOTAL,
            })(<Input placeholder={formatMessage({ id: 'app.inverter.group-base-input' })} />)}
          </FormItem>
          <FormItem label={formatMessage({ id: 'app.inverter.group-temperature' })} {...this.formLayout}>
            {getFieldDecorator('TempParameter', {
              rules: [{ required: true, message: formatMessage({ id: 'app.inverter.group-temperature-input' }) },
              {validator:this.validatorNumber}
              ],
              initialValue: getCurrentGroup.Info.SunShine,
            })(<Input placeholder={formatMessage({ id: 'app.inverter.group-temperature-input' })} />)}
          </FormItem>
          <FormItem {...this.formLayout} label={formatMessage({ id: 'app.inverter.group-description' })}>
            {getFieldDecorator('Description', {
              rules: [{ message: formatMessage({ id: 'app.inverter.group-description-input' }), min: 5 }],
              initialValue: getCurrentGroup.Info.Description,
            })(<TextArea rows={2} placeholder={formatMessage({ id: 'app.inverter.group-description-input' })} />)}
          </FormItem>
          <FormItem {...this.formLayout} label={formatMessage({ id: 'app.inverter.group-mppt' })}>
          {getFieldDecorator('MPPT',{ 
            valuePropName: 'checked',
            initialValue: getCurrentGroup.Info.MPPT==='1'? true:false,
            })(<Switch checkedChildren={formatMessage({ id: 'app.inverter.switch-on' })} 
              unCheckedChildren={formatMessage({ id: 'app.inverter.switch-off' })} />)}
        </FormItem>
        </Form>);
    
    //群组穿梭框
    const groupTransfer=<Transfer className={styles.transfer}
            dataSource={inverterList}
            showSearch
            filterOption={this.filterOption}
            targetKeys={targetKeys}
            onChange={this.handleChangeTransfer}
            onSearch={this.handleSearch}
            render={item => item.GoodsID}
            rowKey={record => record.AutoId}
            titles={[formatMessage({ id: 'app.inverter.machine-list' }), formatMessage({ id: 'app.inverter.group-inverter' })]}
            listStyle={{
              width: 250,
              height: 350,
            }}
      />
    
    //操作成功
    const successful=(
      <Result 
      type={addStatus? 'success' : 'error'}
      title={addStatus? formatMessage({ id: 'app.inverter.successful-operation' }) : formatMessage({ id: 'app.inverter.error-operation' })}
      actions={
        <Button type="primary" onClick={this.handleDone} className={styles.resultBottom}>
          <FormattedMessage id="app.inverter.ok" defaultMessage="ok" />
        </Button>
      }
      className={styles.formResult}
    />
    );
    
    
    return (
      <React.Fragment>
        <div style={{ paddingBottom: '6px' }}>
          <Select
            showSearch
            style={{ width: 200 }}
            defaultValue={JSON.stringify(query)==='{}' ? MemberAutoID : query.autoId}
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
              <FormattedMessage id="app.inverter.group" defaultMessage="group" />
            }
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            // extra={extraContent}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={this.showModal}
              ref={component => {
                /* eslint-disable */
                this.addBtn = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              <FormattedMessage id="app.inverter.add-group" defaultMessage="add-group" />
            </Button>
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list.AllGroupList}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a
                      onClick={e => {
                        e.preventDefault();
                        this.showEditModal(item.AutoID);
                      }}
                    >
                      <FormattedMessage id="app.inverter.edit" defaultMessage="edit" />
                    </a>,
                     <a 
                     onClick={e => {
                        e.preventDefault();
                        showDelete(item.AutoID);
                      }}
                     >
                      <FormattedMessage id="app.inverter.delete" defaultMessage="delete" />
                    </a>,
                    // <MoreBtn current={item} />,
                  ]}
                >
                  <List.Item.Meta
                    // avatar={<Avatar src={item.logo} shape="square" size="large" />}
                    title={<a style={{color:'#1890ff'}} onClick={this.handleClickRouter.bind(this,item.AutoID)}>{item.GoodsTypeName}</a>}
                    // description={item.subDescription}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
        <Modal
          title={currStatus ? formatMessage({ id: 'app.inverter.edit-group' }) : formatMessage({ id: 'app.inverter.add-group' })}
          className={styles.standardListForm}
          width={640}
          bodyStyle={{ padding: '0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
           <Steps current={currentSteps} className={styles.steps}>
              <Step title={currStatus ? formatMessage({ id: 'app.inverter.edit-group.info' }) : formatMessage({ id: 'app.inverter.add-group.info' })} />
              <Step title={currStatus ? formatMessage({ id: 'app.inverter.edit-group.inverter' }) : formatMessage({ id: 'app.inverter.add-group.inverter' })} />
              <Step title={formatMessage({ id: 'app.inverter.complete' })} />
            </Steps>
          {
            currentSteps===1 ? groupTransfer :
            currentSteps===2 ? successful :
            groupForm 
          }
        </Modal>
      </React.Fragment>
    );
  }
}

export default BasicList;
