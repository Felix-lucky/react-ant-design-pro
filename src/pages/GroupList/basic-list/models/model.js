import { groupList,getAllMember } from '@/services/api';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'groupList',

  state: {
    list: [],
    accountList:[],
  },

  effects: {
    //获取群组列表
    *fetch({ payload }, { call, put }) {
      const response = yield call(groupList, payload);
      const data=response.AllGroupList;
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
        payload:result,
      });
    },
    //获取当前所有账户
    *fetchAccount({ payload }, { call, put }) {
      const response = yield call(getAllMember, payload);
      yield put({
        type: 'queryAccount',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    //跳转群组详情
    *fetchId({ payload }, { call, put }) {
      yield put(
        routerRedux.push({
          pathname: '/grouplist/group/advanced-profile',
          query: {
            id: payload.id,
          },
        }));
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
  },
};
