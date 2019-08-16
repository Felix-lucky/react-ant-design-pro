import { fakeRegister } from '@/services/api';
import { forgotPassword } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    //注册
    *submit({ payload }, { call, put }) {
      const response = yield call(fakeRegister, payload);

      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
    //找回密码
    *forgot({ payload }, { call, put }) {
      const response = yield call(forgotPassword, payload);

      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
  },

  reducer: {
    registerHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
