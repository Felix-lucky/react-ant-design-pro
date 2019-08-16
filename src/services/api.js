import { stringify } from 'qs';
import request from '@/utils/request';
import { async } from 'q';

const URL='CodeIgniter/index.php/PrimeVOLT/web/v1/Inverterapi/';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

/**
 *
 *登录接口
 * @export
 * @param {*} params 参数
 * @returns
 */
export async function fakeAccountLogin(params) {
  return request(`/server/api/${URL}UserLogin`, {
    method: 'POST',
    body: params,
  });
}

/**
 *列表页模块
 *当前账号所有历史记录信息
 * @export
 * @param {*} params 参数
 * @returns
 */
export async function logsList(params){
  return request(`/server/api/${URL}LogMemberID`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 * 个人页模块
 * 
 */
/**
 *
 *查询个人信息
 * @export
 * @param {*} params 参数
 */
export async function getAcountInfo(params) {
  return request(`/server/api/${URL}GetMemberData`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *更新个人资料
 * @export
 * @param {*} params 参数
 * @returns
 */
export async function updateAcountInfo(params) {
  return request(`/server/api/${URL}UpdateMemberData`,{
    method:'POST',
    body:params,
  });
}

/**
 *修改个人密码
 *
 * @export
 * @param {*} params 参数
 * @returns
 */
export async function alterAcountPassword(params){
  return request(`/server/api/${URL}alterUserPW`,{
    method:'POST',
    body:params,
  });
}

/**
 *绑定账户
 *
 * @export
 * @param {*} params 参数
 * @returns
 */
export async function bindAccount(params) {
  return request(`/server/api/${URL}AddSubAccount`,{
    method:'POST',
    body:params,
  });
}

/**
 *查询子账号
 *
 * @export
 * @param {*} params
 * @returns
 */
export async function getSubAccount(params) {
  return request(`/server/api/${URL}getSubAccount`,{
    method:'POST',
    body:params,
  });
}

/**
 *删除子账号
 *
 * @export
 * @param {*} params
 * @returns
 */
export async function deleteSubAccount(params) {
  return request(`/server/api/${URL}deleteSubAccount`,{
    method:'POST',
    body:params,
  });
}

/**
 *监控模块
 *
 * 获取账号列表 监控页
 * @export
 * @param {*} params
 * @returns
 */
export async function accountList(params) {
  return request(`/server/api/${URL}MemberAllMonitor`,{
    method:'POST',
    body:params,
  });
}

/**
 *分析页
 *获取总数据
 * @export
 * @param {*} params
 * @returns
 */
export async function accountAnalysis(params) {
  return request(`/server/api/${URL}MemberAllAnalysis`,{
    method:'POST',
    body:params,
  });
}

/**
 *群组模块
 *获取群组列表
 * @export
 * @param {*} params
 * @returns
 */
export async function groupList(params) {
  return request(`/server/api/${URL}GroupList`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *获取机器列表
 * @export
 * @param {*} params
 * @returns
 */
export async function inverterList(params) {
  return request(`/server/api/${URL}InverterList`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *获取当前群组信息
 * @export
 * @param {*} params
 * @returns
 */
export async function groupDetail(params) {
  return request(`/server/api/${URL}GroupDetail`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *获取当前机器信息
 * @export
 * @param {*} params
 * @returns
 */
export async function inverterDetail(params) {
  return request(`/server/api/${URL}InverterDetail`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *获取整体今日发电功率
 * @export
 * @param {*} params
 * @returns
 */
export async function getAllPacDay(params) {
  return request(`/server/api/${URL}getAllPacDay`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *获取整体月发电量
 * @export
 * @param {*} params
 * @returns
 */
export async function getAllPacMonth(params) {
  return request(`/server/api/${URL}getAllPacMonth`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *获取整体年发电量
 * @export
 * @param {*} params
 * @returns
 */
export async function getAllPacYear(params) {
  return request(`/server/api/${URL}getAllPacYear`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *获取当日发电量排名
 * @export
 * @param {*} params
 * @returns
 */
export async function getAllGroupOrderbyEtoday(params) {
  return request(`/server/api/${URL}getAllGroupOrderbyEtoday`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *获取账户列表
 * @export
 * @param {*} params
 * @returns
 */
export async function getAllMember(params) {
  return request(`/server/api/${URL}getAllAllMember`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *获取群组日总和发电曲线
 * @export
 * @param {*} params
 * @returns
 */
export async function groupDetailDayLineSum(params) {
  return request(`/server/api/${URL}GroupDetailDayLineSum`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *获取群组日单机发电曲线
 * @export
 * @param {*} params
 * @returns
 */
export async function groupDetailDayLine(params) {
  return request(`/server/api/${URL}GroupDetailDayLine`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *获取群组年总和发电曲线
 * @export
 * @param {*} params
 * @returns
 */
export async function groupDetailMonthLineSum(params) {
  return request(`/server/api/${URL}GroupDetailMonthLineSum`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *获取群组年单机发电曲线
 * @export
 * @param {*} params
 * @returns
 */
export async function groupDetailMonthLine(params) {
  return request(`/server/api/${URL}GroupDetailMonthLine`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *获取群组年总和发电曲线
 * @export
 * @param {*} params
 * @returns
 */
export async function groupDetailYearLineSum(params) {
  return request(`/server/api/${URL}GroupDetailYearLineSum`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *获取群组年单机发电曲线
 * @export
 * @param {*} params
 * @returns
 */
export async function groupDetailYearLine(params) {
  return request(`/server/api/${URL}GroupDetailYearLine`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *获取日单机发电曲线
 * @export
 * @param {*} params
 * @returns
 */
export async function inverterDetailDayLine(params) {
  return request(`/server/api/${URL}InverterDetailDayLine`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *获取月单机发电曲线
 * @export
 * @param {*} params
 * @returns
 */
export async function inverterDetailMonthLine(params) {
  return request(`/server/api/${URL}InverterDetailMonthLine`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *获取年单机发电曲线
 * @export
 * @param {*} params
 * @returns
 */
export async function inverterDetailYearLine(params) {
  return request(`/server/api/${URL}InverterDetailYearLine`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *群组资息资讯
 * @export
 * @param {*} params
 * @returns
 */
export async function groupDetailInfo(params) {
  return request(`/server/api/${URL}GroupDetailInfo`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *群组机器列表
 * @export
 * @param {*} params
 * @returns
 */
export async function groupDetailList(params) {
  return request(`/server/api/${URL}GroupDetailList`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *群组详细参数
 * @export
 * @param {*} params
 * @returns
 */
export async function groupDetailParameter(params) {
  return request(`/server/api/${URL}GroupDetailParameter`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *群组历史记录
 * @export
 * @param {*} params
 * @returns
 */
export async function groupLogGoodsID(params) {
  return request(`/server/api/${URL}getGroupLogGoodsID`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *单机历史记录
 * @export
 * @param {*} params
 * @returns
 */
export async function getLogGoodsID(params) {
  return request(`/server/api/${URL}getLogGoodsID`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *单机资讯
 * @export
 * @param {*} params
 * @returns
 */
export async function inverterDetailInfo(params) {
  return request(`/server/api/${URL}InverterDetailInfo`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *单机详细参数
 * @export
 * @param {*} params
 * @returns
 */
export async function inverterDetailParameter(params) {
  return request(`/server/api/${URL}InverterDetailParameter`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *机器列表
 * @export
 * @param {*} params
 * @returns
 */
export async function getAllMemberInverter(params) {
  return request(`/server/api/${URL}getAllMemberInverter`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *添加群组
 * @export
 * @param {*} params
 * @returns
 */
export async function insertGroupInfo(params) {
  return request(`/server/api/${URL}insertGroupInfo`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *查询当前群组信息
 * @export
 * @param {*} params
 * @returns
 */
export async function updateGetGroupInfo(params) {
  return request(`/server/api/${URL}updateGetGroupInfo`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *编辑当前群组信息
 * @export
 * @param {*} params
 * @returns
 */
export async function updateGroupInfo(params) {
  return request(`/server/api/${URL}updateGroupInfo`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *删除当前群组
 * @export
 * @param {*} params
 * @returns
 */
export async function deleteGroup(params) {
  return request(`/server/api/${URL}deleteGroup`,{
    method:'POST',
    body:params,
  });
}

/**
 *
 *编辑当前机器信息
 * @export
 * @param {*} params
 * @returns
 */
export async function updateGoodsName(params) {
  return request(`/server/api/${URL}updateGoodsName`,{
    method:'POST',
    body:params,
  });
}



export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function forgotPassword(params) {
  return request('/api/forgot_password', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
