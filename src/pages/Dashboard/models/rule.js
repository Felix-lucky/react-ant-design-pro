import { queryRule, accountList } from '@/services/api';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'rule',

  state: {
    data: {},
    acountId:undefined,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(accountList, payload);
      const data=response.AllUserLight;
      const normal=data.filter(item=>item.Light===1);
      const fault=data.filter(item=>item.Light===2);
      const standby=data.filter(item=>item.Light===3);
      const offline=data.filter(item=>item.Light===4);
      const num={
        account:0,
        normal:0,
        fault:0,
        standby:0,
        offline:0,
      }
      num.account=data.length;
      num.normal=normal.length;
      num.fault=fault.length;
      num.standby=standby.length;
      num.offline=offline.length;
      const result={
        list:data,
        ...num,
      }
      yield put({
        type: 'save',
        payload: result,
      });
    },
    *acountId({ payload }, { call, put }) {
      yield put(
        routerRedux.push({
          pathname: '/grouplist/group/basic-list',
          query: {
            autoId: payload.autoId,
          },
        }));
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
