import globalHeader from './en-US/globalHeader';
import menu from './en-US/menu';
import settings from './en-US/settings';
import login from './en-US/login';
import form from './en-US/form';
import analysis from './en-US/analysis';
import logs from './en-US/logs';
import monitor from './en-US/monitor';
import bulletin from './en-US/bulletin';
import inverter from './en-US/inverter';
import exception from './en-US/exception';

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.home.introduce': 'introduce',
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
