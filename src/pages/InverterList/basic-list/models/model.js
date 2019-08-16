import { inverterList,getAllMember,updateGoodsName} from '@/services/api';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'basicList',

  state: {
    list: [],
    accountList:[],
    editStatus:true,
  },

  effects: {
    //机器列表
    *fetch({ payload }, { call, put }) {
      const response = yield call(inverterList, payload);
      const data=response.AllInverterList;
      const normal=data.filter(item=>item.Light===1);
      const fault=data.filter(item=>item.Light===2);
      const standby=data.filter(item=>item.Light===3);
      const offline=data.filter(item=>item.Light===4);
      const num={
        normal:0,
        fault:0,
        standby:0,
        offline:0,
      }
      num.normal=normal.length;
      num.fault=fault.length;
      num.standby=standby.length;
      num.offline=offline.length;
      const result={
        ...num,
        ...response,
      }
      yield put({
        type: 'queryList',
        payload: result,
      });
    },
    //账户列表
    *fetchAccount({ payload }, { call, put }) {
      const response = yield call(getAllMember, payload);
      yield put({
        type: 'queryAccount',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    //跳转详情页面
    *fetchId({ payload }, { call, put }) {
      yield put(
        routerRedux.push({
          pathname: '/inverterlist/inverter/advanced-profile',
          query: {
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
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    queryAccount(state, action) {
      return {
        ...state,
        accountList: action.payload,
      };
    },
    queryStatus(state, action) {
      return {
        ...state,
        editStatus: action.payload.status,
      };
    },
  },
};
