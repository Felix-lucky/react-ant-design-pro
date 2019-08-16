import { groupDetail,groupDetailInfo,groupDetailList,groupDetailParameter,groupLogGoodsID,updateGoodsName } from '@/services/api';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'advancedProfile',

  state: {
    advancedInfo:[],
    detailInfo:[],
    inverterList:[],
    parameterList:[],
    logsList:[],
    editStatus:true,
    loading: false,
  },

  effects: {
    //获取当前群组信息
    *fetch({payload},{call,put}){
      const response = yield call(groupDetail, payload);
      yield put({
        type: 'queryGroup',
        payload:response,
      });
    },
    //获取当前讯息资讯
    *detailInfo({payload},{call,put}){
      const response = yield call(groupDetailInfo, payload);
      yield put({
        type: 'queryInfo',
        payload:response,
      });
    },
    //获取机器列表
    *inverterList({payload},{call,put}){
      const response = yield call(groupDetailList, payload);
      yield put({
        type: 'queryList',
        payload:Array.isArray(response.AllInverterList) ? response.AllInverterList : [],
      });
    },
     //获取详细参数
     *inverterParameter({payload},{call,put}){
      const response = yield call(groupDetailParameter, payload);
      yield put({
        type: 'queryParameter',
        payload:Array.isArray(response.AllInverterList) ? response.AllInverterList : [],
      });
    },
    //获取历史信息
    *inverterLogs({payload},{call,put}){
      const response = yield call(groupLogGoodsID, payload);
      yield put({
        type: 'queryLogs',
        payload:response,
      });
    },
    //跳转单机详情
    *fetchId({ payload }, { call, put }) {
      yield put(
        routerRedux.push({
          pathname: '/dashboard/analysis/inverter',
          state: {
            goodsId: payload.goodsId,
          },
        }));
    },
    //编辑机器名
    *submits({ payload }, { call, put }) {
      const response = yield call(updateGoodsName, payload); 
      yield put({
        type: 'queryStatus',
        payload: response,
      });
    },
  },

  reducers: {
    queryGroup(state,action){
      return {
        ...state,
        advancedInfo:action.payload
      }
    },
    queryInfo(state,action){
      return {
        ...state,
        detailInfo:action.payload
      }
    },
    queryList(state,action){
      return {
        ...state,
        inverterList:action.payload
      }
    },
    queryParameter(state,action){
      return {
        ...state,
        parameterList:action.payload
      }
    },
    queryLogs(state,action){
      return {
        ...state,
        logsList:action.payload
      }
    },
    queryStatus(state, action) {
      return {
        ...state,
        editStatus: action.payload.status,
      };
    },
  },
};
