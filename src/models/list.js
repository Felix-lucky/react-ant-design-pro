import { queryFakeList, removeFakeList, addFakeList, updateFakeList } from '@/services/api';

export default {
  namespace: 'list',

  state: {
    list: [],
    count:2,
    listIf:true,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *number(action, { call, put }) {
        yield put({ 
          type: 'addCount',
        });
    },
    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeFakeList : updateFakeList;
      } else {
        callback = addFakeList;
      }
      const response = yield call(callback, payload); // post
      yield put({
        type: 'queryList',
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
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
        listLength:action.payload.length<3?state.listIf:false,
      };
    },
    addCount(state,action) { 
      return {
        ...state,
        count:state.count+1,
      };
     },
  },
};
