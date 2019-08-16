import { inverterDetailDayLine,inverterDetailMonthLine,inverterDetailYearLine } from '@/services/api';

export default {
  namespace: 'inverterChart',

  state: {
    loading: false,
    inverterDay:[],
    inverterMonth:[],
    inverterYear:[],
  },

  effects: {
    //日发电量
    *fetchDay({ payload }, { call , put }) {
      const response = yield call(inverterDetailDayLine,payload);
      yield put({
        type: 'queryDay',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    //月发电量
    *fetchMonth({ payload }, { call , put }) {
      const response = yield call(inverterDetailMonthLine,payload);
      yield put({
        type: 'queryMonth',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    //年发电量
    *fetchYear({ payload }, { call , put }) {
      const response = yield call(inverterDetailYearLine,payload);
      yield put({
        type: 'queryYear',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
  },

  reducers: {
    queryDay(state, action) {
      return {
        ...state,
        inverterDay: action.payload,
      };
    },
    queryMonth(state, action) {
      return {
        ...state,
        inverterMonth: action.payload,
      };
    },
    queryYear(state, action) {
      return {
        ...state,
        inverterYear: action.payload,
      };
    },
    clear() {
      return {
        inverterDay:[],
        inverterMonth:[],
        inverterYear:[],
      };
    },
  },
};
