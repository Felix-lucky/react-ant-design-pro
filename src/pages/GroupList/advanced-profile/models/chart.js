import { groupDetailDayLineSum,groupDetailDayLine,groupDetailMonthLineSum,groupDetailMonthLine,groupDetailYearLineSum,groupDetailYearLine } from '@/services/api';

export default {
  namespace: 'chart',

  state: {
    loading: false,
    dayLineSum:[],
    dayLine:[],
    monthLineSum:[],
    monthLine:[],
    yearLineSum:[],
    yearLine:[],
  },

  effects: {
    //日群组发电量总和
    *fetchDaySum({ payload }, { call , put }) {
      const response = yield call(groupDetailDayLineSum,payload);
      
      yield put({
        type: 'queryDaySum',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    //日单机发电量
    *fetchDay({ payload }, { call , put }) {
      const response = yield call(groupDetailDayLine,payload);
      yield put({
        type: 'queryDay',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    //月群组发电量总和
    *fetchMonthSum({ payload }, { call , put }) {
      const response = yield call(groupDetailMonthLineSum,payload);
      yield put({
        type: 'queryMonthSum',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    //月单机发电量
    *fetchMonth({ payload }, { call , put }) {
      const response = yield call(groupDetailMonthLine,payload);
      yield put({
        type: 'queryMonth',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    //年群组发电量总和
    *fetchYearSum({ payload }, { call , put }) {
      const response = yield call(groupDetailYearLineSum,payload);
      yield put({
        type: 'queryYearSum',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    //年单机发电量
    *fetchYear({ payload }, { call , put }) {
      const response = yield call(groupDetailYearLine,payload);
      yield put({
        type: 'queryYear',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
  },

  reducers: {
    queryDaySum(state, action) {
      return {
        ...state,
        dayLineSum: action.payload,
      };
    },
    queryDay(state, action) {
      return {
        ...state,
        dayLine: action.payload,
      };
    },
    queryMonthSum(state, action) {
      return {
        ...state,
        monthLineSum: action.payload,
      };
    },
    queryMonth(state, action) {
      return {
        ...state,
        monthLine: action.payload,
      };
    },
    queryYearSum(state, action) {
      return {
        ...state,
        yearLineSum: action.payload,
      };
    },
    queryYear(state, action) {
      return {
        ...state,
        yearLine: action.payload,
      };
    },
    clear() {
      return {
        dayLineSum:[],
        dayLine:[],
        monthLineSum:[],
        monthLine:[],
        yearLineSum:[],
        yearLine:[],
      };
    },
  },
};
