import { logsList } from '@/services/api';

export default {
  namespace: 'logs',
  state: {
    list: [], 
    count: 2, 
    ifNumber: true, 
  },

  effects: {
    //获取历史信息数据
    *fetch({ payload }, { call, put }) {
      const response = yield call(logsList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.status) ? response.status : [],
      });
    },
    //点击加载更多数据
    *add({ payload }, { call, put }) {
      const response = yield call(logsList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response.status) ? response.status : [],
      });
    },
    //改变页数
    *number({ payload }, { cal, put }) {
      yield put({
        type: 'addCount',
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
        ifNumber: action.payload.length>0 ? state.ifNumber : false,
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
