import globalHeader from './zh-TW/globalHeader';
import menu from './zh-TW/menu';
import settings from './zh-TW/settings';
import login from './zh-TW/login';
import form from './zh-TW/form';
import analysis from './zh-TW/analysis';
import logs from './zh-TW/logs';
import monitor from './zh-TW/monitor';
import bulletin from './zh-TW/bulletin';
import inverter from './zh-TW/inverter';
import exception from './zh-TW/exception';

export default {
  'navBar.lang': '語言',
  'layout.user.link.help': '幫助',
  'layout.user.link.privacy': '隱私',
  'layout.user.link.terms': '條款',
  'app.home.introduce': '介紹',
  'app.forms.basic.title': '基礎表單',
  'app.forms.basic.description':
    '表單頁用於向用戶收集或驗證信息，基礎表單常見於數據項較少的表單場景。',
  ...globalHeader,
  ...menu,
  ...settings,
  ...login,
  ...form,
  ...analysis,
  ...logs,
  ...monitor,
  ...bulletin,
  ...inverter,
  ...exception,
  
};
