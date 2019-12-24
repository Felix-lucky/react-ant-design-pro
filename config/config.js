// ref: https://umijs.org/config/
import { primaryColor } from '../src/defaultSettings';

export default {
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: { hmr: true },
        targets: { ie: 11 },
        locale: {
          enable: true,
          // default false
          default: 'zh-CN',
          // default zh-CN
          baseNavigator: true,
        },
        // default true, when it is true, will use `navigator.language` overwrite default
        dynamicImport: { loadingComponent: './components/PageLoading/index' },
      },
    ],
    [
      'umi-plugin-pro-block',
      {
        moveMock: false,
        moveService: false,
        modifyRequest: true,
        autoAddMenu: true,
      },
    ],
  ],
  targets: { ie: 11 },
  /**
   * 路由相关配置
   */
  routes: [
    // user
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          path: '/user',
          redirect: '/user/login',
        },
        {
          path: '/user/login',
          name: 'login',
          component: './User/Login',
        },
        {
          path: '/user/register',
          name: 'register',
          component: './User/Register',
        },
        {
          path: '/user/forgot-password',
          name: 'forgot-password',
          component: './User/ForgotPassword',
        },
      ],
    },
    // app
    {
      path: '/',
      component: '../layouts/BasicLayout',
      Routes: ['src/pages/Authorized'],
      authority: ['admin', 'user'],
      routes: [
        {
          path: '/',
          redirect: '/dashboard/analysis',
        },
        // dashboard
        {
          path: '/dashboard',
          name: 'dashboard',
          icon: 'dashboard',
          routes: [
            {
              path: '/dashboard/analysis',
              name: 'analysis',
              component: './Dashboard/AnalysisContainer',
              hideChildrenInMenu: true,
              routes:[
                {
                  path: '/dashboard/analysis',
                  redirect: '/dashboard/analysis/list',
                },
                {
                  path: '/dashboard/analysis/list',
                  name: 'group',
                  component: './Dashboard/Analysis',
                },
                {
                  path: '/dashboard/analysis/group-detail',
                  name: 'group',
                  component: './GroupList/advanced-profile',
                },
                {
                  path: '/dashboard/analysis/inverter',
                  name: 'inverter',
                  component: './InverterList/advanced-profile',
                },
              ],
            },
            {
              path: '/dashboard/monitor',
              name: 'monitor',
              component: './Dashboard/Monitor',
            },
          ],
        },
        // group
        // {
        //   path: '/grouplist',
        //   name: 'group',
        //   icon: 'cluster',
        //   routes: [
        //     {
        //       path: '/grouplist/group',
        //       name: 'group-list',
        //       component: './GroupList/group',
        //       hideChildrenInMenu: true,
        //       routes: [
        //         {
        //           path: '/grouplist/group',
        //           redirect: '/grouplist/group/basic-list',
        //         },
        //         {
        //           path: '/grouplist/group/basic-list',
        //           name: 'group-list',
        //           component: './GroupList/basic-list',
        //         },
        //         {
        //           path: '/grouplist/group/advanced-profile',
        //           name: 'inverter-advanced',
        //           component: './InverterList/advanced-profile',
        //         },
        //       ],
        //     },
        //   ],
        // },
        // inverter
        // {
        //   path: '/inverterlist',
        //   name: 'inverter',
        //   icon: 'thunderbolt',
        //   routes: [
        //     {
        //       path: '/inverterlist/inverter',
        //       name: 'inverter-list',
        //       component: './InverterList/inverter',
        //       hideChildrenInMenu: true,
        //       routes: [
        //         {
        //           path: '/inverterlist/inverter',
        //           redirect: '/inverterlist/inverter/basic-list',
        //         },
        //         {
        //           path: '/inverterlist/inverter/basic-list',
        //           name: 'inverter-list',
        //           component: './InverterList/basic-list',
        //         },
        //         {
        //           path: '/inverterlist/inverter/advanced-profile',
        //           name: 'inverter-advanced',
        //           component: './InverterList/advanced-profile',
        //         },
        //       ],
        //     },
        //   ],
        // },
        // //list
        {
          path: '/list',
          icon: 'table',
          name: 'list',
          routes: [
            {
              path: '/list/logs',
              name: 'logs',
              component: './List/logs',
            },
          ],
        },
        // bulletin
        // {
        //   path:'/bulletin',
        //   icon: 'sound',
        //   name:'bulletin',
        //   routes:[
        //     {
        //       path: '/bulletin/news',
        //       name: 'news',
        //       component: './Bulletin/news',
        //     },
        //     {
        //       path: '/bulletin/download',
        //       name: 'download',
        //       component: './Bulletin/download',
        //     },
        //   ]
        // },
        // account
        {
          name: 'account',
          icon: 'user',
          path: '/account',
          routes: [
            {
              path: '/account/settings',
              name: 'settings',
              component: './Account/Settings/Info',
              routes: [
                {
                  path: '/account/settings',
                  redirect: '/account/settings/base',
                },
                {
                  path: '/account/settings/base',
                  component: './Account/Settings/BaseView',
                },
                {
                  path: '/account/settings/security',
                  component: './Account/Settings/SecurityView',
                },
                {
                  path: '/account/settings/binding',
                  component: './Account/Settings/BindingView',
                },
                {
                  path: '/account/settings/sub',
                  component: './Account/Settings/subAccount',
                },
                {
                  path: '/account/settings/notification',
                  component: './Account/Settings/NotificationView',
                },
              ],
            },
          ],
        },
        // exception
        {
          name: 'exception',
          icon: 'warning',
          path: '/exception',
          hideInMenu: true,
          routes: [
            // exception
            {
              path: '/exception/403',
              name: 'not-permission',
              component: './Exception/403',
            },
            {
              path: '/exception/404',
              name: 'not-find',
              component: './Exception/404',
            },
            {
              path: '/exception/500',
              name: 'server-error',
              component: './Exception/500',
            },
          ],
        },
        {
          component: '404',
        },
      ],
    },
  ],
  proxy: {
    '/server/api/': {
      target: 'http://www.senergytec.cn/',
      changeOrigin: true,
      pathRewrite: { '^/server': '' },
    },
  },
  disableRedirectHoist: true,
  /**
   * webpack 相关配置
   */
  define: { APP_TYPE: process.env.APP_TYPE || '' },
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: { 'primary-color': primaryColor },
  externals: { '@antv/data-set': 'DataSet' },
  ignoreMomentLocale: true,
  lessLoaderOptions: { javascriptEnabled: true },
  // history: 'hash', // 采用hash路由：#/xxx的形式
  // base:'./',
  // publicPath:'./',
};
