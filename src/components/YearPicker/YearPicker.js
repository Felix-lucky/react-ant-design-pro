import React, { Component } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

/**
 *antd 选择年组件
 *
 * @class YearPicker
 * @extends {Component}
 */
class YearPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: moment(), //默认当前年
      status: false, //默认控制弹层是否展开
    };
  }
  /**
   *日历面板切换的回调
   *value 选中的年
   * @memberof YearPicker
   */
  onPanelChange = value => {
    this.setState({
      year: value,
      status: !this.state.status,
    });
    //日历面板改变了获取选中的年回调函数
    if(typeof this.props.onChange === 'function') this.props.onChange(value);
  };
  /**
   *弹出日历和关闭日历的回调
   *open true
   * @memberof YearPicker
   */
  onOpenChange = open => {
    if (open) {
      this.setState({
        status: !this.state.status,
      });
    }
  };

  render() {
    const { year, status } = this.state;
    const { value }=this.props;
    return (
      <DatePicker
        mode="year"
        format="YYYY"
        open={status}
        value={moment(year)}
        defaultValue={moment(year)}
        onPanelChange={this.onPanelChange}
        onOpenChange={this.onOpenChange}
      />
    );
  }
}

export default YearPicker;
