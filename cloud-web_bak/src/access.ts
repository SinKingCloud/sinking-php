/**
 * 权限管理
 * @param initialState
 */
export default function access(initialState: { currentUser?: API.UserInfo | undefined }) {
  const {currentUser} = initialState || {};
  return {
    canUser: currentUser && currentUser?.is_admin === false && currentUser?.is_master === false,//普通用户
    canAdmin: currentUser && currentUser?.is_admin === true,//站长用户
    canMaster: currentUser && currentUser?.is_master === true,
  };
}
