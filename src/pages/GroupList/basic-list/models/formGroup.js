import { getAllMemberInverter,insertGroupInfo,updateGetGroupInfo,updateGroupInfo,deleteGroup} from '@/services/api';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'formGroup',

  state: {
    inverterList:[],
    addStatus:true,
    getCurrentGroup:{
      Info:{},
      inverterlist:[],
    },
  },

  effects: {
    //获取账户的所有机器
    *accountInverter({ payload }, { call, put }) {
      const response = yield call(getAllMemberInverter, payload);
      yield put({
        type: 'queryInverter',
        payload: Array.isArray(response.inverterlist) ? response.inverterlist : [],
      });
    },
    //添加群组
    *addGroup({ payload }, { call, put }) {
      const response = yield call(insertGroupInfo, payload);
      yield put({
        type: 'queryAdd',
        payload: response,
      });
    },
     //查询当前群组
     *getGroup({ payload }, { call, put }) {
      const response = yield call(updateGetGroupInfo, payload);
      yield put({
        type: 'queryGetGroup',
        payload: response,
      });
    },
     //编辑群组
     *editGroup({ payload }, { call, put }) {
      const response = yield call(updateGroupInfo, payload);
      yield put({
        type: 'queryAdd',
        payload: response,
      });
    },
    //删除群组
    *deleteGroup({ payload }, { call, put }) {
        const response = yield call(deleteGroup, payload);
        yield put({
          type: 'queryAdd',
          payload: response,
        });
      },
  },

  reducers: {
    queryInverter(state, action) {
      return {
        ...state,
        inverterList: action.payload,
      };
    },
    queryAdd(state, action) {
      return {
        ...state,
        addStatus: action.payload.status,
      };
    },
    queryGetGroup(state, action) {
      return {
        ...state,
        getCurrentGroup: action.payload,
      };
    },
    clear() {
      return {
        inverterList:[],
        addStatus:true,
        getCurrentGroup:{
          Info:{},
          inverterlist:[],
        },
      };
    },
  },
};
