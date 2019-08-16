import {
  getAcountInfo,
  updateAcountInfo,
  alterAcountPassword,
  getSubAccount,
  bindAccount,
  deleteSubAccount,
} from '@/services/api';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { message } from 'antd';

message.config({
  top: 100,
  duration: 2,
  maxCount: 3,
});

export default {
  namespace: 'account',

  state: {
    accountInfo: {},
    subAccount: [],
    updateStatus: undefined,
    alterStatus: undefined,
    deleteStatus: undefined,
    bindStatus: undefined,
    count: 2,
    ifNumber: true,
  },
  effects: {
    //查询个人资料
    *fetch({ payload }, { call, put }) {
      const response = yield call(getAcountInfo, payload);
      yield put({
        type: 'queryAccount',
        payload: response,
      });
    },
    //更新个人资料
    *update({ payload }, { call, put }) {
      const response = yield call(updateAcountInfo, payload);
      yield put({
        type: 'queryUpdate',
        payload: response,
      });
      if (response.status === 'true') {
        message.success(formatMessage({ id: 'app.settings.basic.ok' }));
      } else {
        message.error(formatMessage({ id: 'app.settings.basic.error' }));
      }
    },
    //修改密码
    *alter({ payload }, { call, put }) {
      const response = yield call(alterAcountPassword, payload);
      yield put({
        type: 'queryAlter',
        payload: response,
      });
      if (response.status === 'true') {
        message.success(formatMessage({ id: 'app.settings.security.ok' }));
      } else {
        message.error(formatMessage({ id: 'app.settings.security.error' }));
      }
    },
    //获取子账号列表
    *sub({ payload }, { call, put }) {
      const response = yield call(getSubAccount, payload);
      yield put({
        type: 'querySub',
        payload: Array.isArray(response) ? response : [],
      });
    },
    //删除子账号
    *delete({ payload }, { call, put }) {
      const response = yield call(deleteSubAccount, payload);
      yield put({
        type: 'queryDelete',
        payload: response,
      });
      if (response.status === 'true') {
        message.success(formatMessage({ id: 'app.settings.sub.ok' }));
      } else {
        message.error(formatMessage({ id: 'app.settings.sub.error' }));
      }
    },
    //绑定子账号
    *bind({ payload }, { call, put }) {
      const response = yield call(bindAccount, payload);
      yield put({
        type: 'queryBind',
        payload: response,
      });
      if (response.status === 'true') {
        message.success(formatMessage({ id: 'app.settings.binding.ok' }));
      } else {
        message.error(formatMessage({ id: 'app.settings.binding.error' }));
      }
    },
    //获取更多子账号页数
    *number({ payload }, { cal, put }) {
      yield put({
        type: 'addCount',
      });
    },
    //获取更多子账号
    *add({ payload }, { call, put }) {
      const response = yield call(getSubAccount, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },
  
  reducers: {
    queryAccount(state, action) {
      return {
        ...state,
        accountInfo: action.payload,
      };
    },
    queryUpdate(state, action) {
      return {
        ...state,
        updateStatus: action.payload.status,
      };
    },
    queryAlter(state, action) {
      return {
        ...state,
        alterStatus: action.payload.status,
      };
    },
    querySub(state, action) {
      return {
        ...state,
        subAccount: action.payload,
        ifNumber: action.payload.length <= 5 ? false : state.ifNumber,
      };
    },
    queryDelete(state, action) {
      return {
        ...state,
        deleteStatus: action.payload.status,
      };
    },
    queryBind(state, action) {
      return {
        ...state,
        bindStatus: action.payload.status,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        subAccount: state.subAccount.concat(action.payload),
      };
    },
    addCount(state, action) {
      return {
        ...state,
        count: state.count + 1,
      };
    },
  },
};
