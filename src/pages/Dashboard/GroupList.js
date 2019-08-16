import React, { PureComponent } from 'react';
import { FormattedMessage,formatMessage } from 'umi/locale';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import { connect } from 'dva';
import {List,Card,Row,Col,Radio,Input,Progress,Button,Icon,Dropdown,Menu,Transfer,
  Avatar,Modal,Form,DatePicker,Select,Steps,Switch ,message,Table,Badge,Divider} from 'antd';
import {numberUnit} from '@/utils/utils';
import { Result } from 'ant-design-pro';
import router from 'umi/router';
import StandardTable from '@/components/StandardTable';
import styles from './GroupList.less';

import Online from "@/assets/online.png";
import Offline from "@/assets/offline.png";
import Fault from "@/assets/fault.png";
import Stanby from "@/assets/stanby.png";

message.config({
  top: 100,
  duration: 2,
  maxCount: 3,
});

const status = [0,
  formatMessage({ id: 'app.monitor.normal' }),
  formatMessage({ id: 'app.monitor.fault' }),
  formatMessage({ id: 'app.monitor.standby' }),
  formatMessage({ id: 'app.monitor.offline' }),
];
const statusMap = [0,'success', 'error', 'warning', 'default'];
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
  
  columns = [
    {
      title: formatMessage({ id: 'app.monitor.status' }),
      dataIndex: 'Light',
      filters: [
        {
          text: status[1],
          value: '1',
        },
        {
          text: status[2],
          value: '2',
        },
        {
          text: status[3],
          value: '3',
        },
        {
          text: status[4],
          value: '4',
        },
      ],
      render(val) {
        if(val!==0){
          return <Badge status={statusMap[val]} text={status[val]} />;
        }
      },
      onFilter: (value, record) => record.Light.toString().includes(value),
    },
    {
      title: formatMessage({ id: 'app.inverter.photo'}),
      render: (text,row) =>(
        <span className={styles.photo}>
          <img src={require('@/assets/plant.png')} alt=""/>
        </span>
      )
    },
    {
      title: formatMessage({ id: 'app.inverter.name' }),
      dataIndex: 'GoodsTypeName',
      render: (text,row) => <a onClick={this.handleClickRouter.bind(this,row.AutoID)}>{text}</a>
    },
    {
      title: formatMessage({ id: 'app.monitor.power' }),
      dataIndex: 'CurrPac',
      render: (text) => {
        return numberUnit(text)+'W';
      }
    },
    {
      title: formatMessage({ id: 'app.monitor.e-today' }),
      dataIndex: 'EToday',
      render: (text) => {
        return numberUnit(text)+'Wh';
      }
    },
    {
      title: formatMessage({ id: 'app.monitor.e-total' }),
      dataIndex: 'Etotal',
      render: (text) => {
        return numberUnit(text)+'Wh';
      }
    },
    {
      title: formatMessage({ id: 'app.monitor.capacity' }),
      dataIndex: 'GoodsKWP',
      render: (text) => {
        return numberUnit(text)+'Wh';
      }
    },
    {
      title: formatMessage({ id: 'app.inverter.operation' }),
      render: (text, row) => (
        <span>
          <a onClick={e => {
            e.preventDefault();
            this.showEditModal(row.AutoID);
          }}>
            <FormattedMessage id="app.inverter.edit" defaultMessage="edit" />
          </a>
          <Divider type="vertical" />
          <a onClick={e => {
            e.preventDefault();
            this.showDelete(row.AutoID);
          }}>
            <FormattedMessage id="app.inverter.delete" defaultMessage="delete" />
          </a>
        </span>
      ),
    },
  ];

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
    const { dispatch,MemberAutoID,} = this.props;
    // if(JSON.stringify(query)!=='{}'){
    //   this.getList(dispatch,query.autoId);
    // }else{
      this.getList(dispatch,MemberAutoID);
    // }
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
    localStorage.setItem('groupId',id);
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

  //删除提示
  showDelete = (id) => {
    Modal.confirm({
      title: formatMessage({ id: 'app.inverter.model-title' }),
      content: formatMessage({ id: 'app.inverter.model-content' }),
      okText: formatMessage({ id: 'app.inverter.ok' }),
      cancelText: formatMessage({ id: 'app.inverter.cancel' }),
      onOk: () => this.deleteItem(id),
    });
  };

  render() {
    const {
      groupList: { list,accountList,},
      formGroup:{ getCurrentGroup,inverterList,addStatus},
      loading,
      form: { getFieldDecorator },
      MemberAutoID,
      // location:{ query },
    } = this.props;
    const { visible, current = {},currStatus,currentSteps,targetKeys} = this.state;
    const modalFooter = currentSteps===1? { onOk: this.handleTransfer, onCancel: this.handleCancel }:
    currentSteps===2? {  footer:null, onCancel: this.handleCancel }:
    {  onOk: this.handleSubmit, onCancel: this.handleCancel }
    // const Info = ({ title, value, bordered ,status}) => (
    //   <div className={styles.headerInfoBox}>
    //     <div className={styles.headerInfoImg}>
    //     <img src={status==1?Online : status==2 ? Fault :status==3 ? Stanby : Offline} alt="online"/>
    //     </div>
    //     <div className={styles.headerInfo}>
    //       <span>{title}</span>
    //       <p>{value}</p>
    //       {bordered && <em />}
    //     </div>
    //   </div>
    // );

    const paginationProps = {
      // showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 3,
      // total: 50,
    };

    // const ListContent = ({ data: { EToday, effect,CurrPac, GreenPercent, Light,CreateDate } }) => (
    //   <div className={styles.listContent}>
    //     <div className={styles.listContentItem}>
    //       <span><FormattedMessage id="app.inverter.parameter.e-today" defaultMessage="e-today" /></span>
    //       <p>{numberUnit(EToday)+'Wh'}</p>
    //     </div>
    //     <div className={styles.listContentItem}>
    //       <span><FormattedMessage id="app.inverter.list.power" defaultMessage="power" /></span>
    //       <p>{numberUnit(CurrPac)+'W'}</p>
    //     </div>
    //     <div className={styles.listContentItem}>
    //       <span><FormattedMessage id="app.inverter.efficiency" defaultMessage="efficiency" /></span>
    //       <p>{numberUnit(effect)}</p>
    //     </div>
    //     {/* <div className={styles.listContentItem}>
    //       <span>RA</span>
    //       <p>90</p>
    //     </div> */}
    //     <div className={styles.listContentItem}>
    //       <span><FormattedMessage id="app.inverter.start-time" defaultMessage="start-time" /></span>
    //       <p>{moment(CreateDate).format('YYYY-MM-DD')}</p>
    //     </div>
    //     <div className={styles.listContentItem}>
    //       <Progress
    //         type="circle"
    //         percent={GreenPercent}
    //         status={
    //           Light===1 ? 'success' :
    //           Light===2 ? 'exception':
    //           Light===3 ? 'active' : 
    //           'normal'
    //         }
    //         strokeWidth={6}
    //         width={40}
    //         style={{ width: '40px' }}
    //       />
    //     </div>
    //   </div>
    // );

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
          {/* <FormItem label={formatMessage({ id: 'app.inverter.group-base' })} {...this.formLayout}>
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
          </FormItem> */}
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
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            bodyStyle={{ padding: '0 32px 8px 32px' }}
          >
            <Button
              type="dashed"
              className={styles.groupAdd}
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
            <Table
            rowKey={record => record.AutoID}
            columns={this.columns}
            dataSource={list.AllGroupList}
            loading={loading}
            pagination={paginationProps}
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
