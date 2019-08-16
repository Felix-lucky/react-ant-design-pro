import { accountAnalysis,getAllGroupOrderbyEtoday,getAllPacDay,getAllPacMonth,getAllPacYear} from '@/services/api';

export default {
  namespace: 'analysis',

  state: {
    visitData: [],
    searchData: [],
    offlineData: [],
    offlineChartData: [],
    radarData: [],
    loading: false,
    AllUserLight:[],
    dayRank:[],
    salesDay: [],
    salesMonth: [],
    salesYear: [],
    grouplist:[],
  },

  effects: {
    //整体数据
    *fetch({ payload }, { call, put }) {
      const response = yield call(accountAnalysis,payload);
      const visitData={
        CurrPac:response.CurrPac,
        EToday:response.EToday,
        ETotal:response.ETotal,
        Htotal:response.Htotal,
        InverterTotalCount:response.InverterTotalCount,
        InverterTotalCountOn:response.InverterTotalCountOn,
        Price:response.Price,
      }
      const len=response.AllUserLight.length;
      const AllUserLight=[];
      for(let i=0;i<len;i++){
        AllUserLight.push({
          key:i+1,
          ...response.AllUserLight[i],
        })
      }
      const result={
        AllLight:response.AllLight,
        visitData,
        AllUserLight,
      }
      yield put({
        type: 'save',
        payload: result,
      });
    },
    //今日发电量排名
    *ranking({ payload }, { call , put }) {
      const response = yield call(getAllGroupOrderbyEtoday,payload);
      yield put({
        type: 'dayRanking',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    //今日发电功率
    *day({ payload }, { call , put }) {
      const response = yield call(getAllPacDay,payload);
      yield put({
        type: 'powerDay',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    //月发电量
    *month({ payload }, { call , put }) {
      const response = yield call(getAllPacMonth,payload);
      yield put({
        type: 'powerMonth',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    //年发电量
    *year({ payload }, { call , put }) {
      const response = yield call(getAllPacYear,payload);
      yield put({
        type: 'powerYear',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    dayRanking(state, action) {
      return {
        ...state,
        dayRank: action.payload,
      };
    },
    powerDay(state, action) {
      return {
        ...state,
        salesDay: action.payload,
      };
    },
    powerMonth(state, action) {
      return {
        ...state,
        salesMonth: action.payload,
      };
    },
    powerYear(state, action) {
      return {
        ...state,
        salesYear: action.payload,
      };
    },
    clear() {
      return {
        visitData: [],
        visitData2: [],
        searchData: [],
        radarData: [],
        AllUserLight:[],
        dayRank:[],
        salesDay: [],
        salesMonth: [],
        salesYear: [],
      };
    },
  },
};
