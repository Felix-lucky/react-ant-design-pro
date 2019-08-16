import { inverterDetail,inverterDetailParameter,inverterDetailInfo,getLogGoodsID } from '@/services/api';

export default {
  namespace: 'inverterfile',

  state: {
    details: [],
    parameters: [],
    logs: [],
    inverterInfo:[],
  },

  effects: {
    //获取当前机器信息
    *fetch({payload},{call,put}){
      const response = yield call(inverterDetail, payload);
      yield put({
        type: 'queryInverter',
        payload:response,
      });
    },
    //获取当前资讯
    *fetchDetail({payload},{call,put}){
      const response = yield call(inverterDetailInfo, payload);
      yield put({
        type: 'queryDetail',
        payload:response,
      });
    },
    //获取当前详细参数
    *fetchParameter({payload},{call,put}){
      const response = yield call(inverterDetailParameter, payload);
      yield put({
        type: 'queryParameter',
        payload:Array.isArray(response.AllInverterList) ? response.AllInverterList : [],
      });
    },
    //获取当前历史信息
    *fetchLogs({payload},{call,put}){
      const response = yield call(getLogGoodsID, payload);
      yield put({
        type: 'queryLogs',
        payload:response,
      });
    },
  },

  reducers: {
    queryInverter(state,action){
      return {
        ...state,
        inverterInfo:action.payload
      }
    },
    queryDetail(state,action){
      return {
        ...state,
        details:action.payload
      }
    },
    queryParameter(state,action){
      return {
        ...state,
        parameters:action.payload
      }
    },
    queryLogs(state,action){
      return {
        ...state,
        logs:action.payload
      }
    },
  },
};
