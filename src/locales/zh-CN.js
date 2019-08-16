import globalHeader from './zh-CN/globalHeader';
import menu from './zh-CN/menu';
import settings from './zh-CN/settings';
import login from './zh-CN/login';
import form from './zh-CN/form';
import analysis from './zh-CN/analysis';
import logs from './zh-CN/logs';
import monitor from './zh-CN/monitor';
import bulletin from './zh-CN/bulletin';
import inverter from './zh-CN/inverter';
import exception from './zh-CN/exception';

export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.home.introduce': '介绍',
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
