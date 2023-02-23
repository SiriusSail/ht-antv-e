/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal (path: string) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
   * @param {string} str
   * @returns {Boolean}
   */
export function validUsername (str: string) {
  // eslint-disable-next-line camelcase
  const valid_map = ['admin', 'editor'];
  return valid_map.indexOf(str.trim()) >= 0;
}
/**
   * 验证数字===非零正整数
   */
export const positiveInteger = (rule: any, value: any, callback: any) => {
  if (value === '') return callback(new Error('请输入数字'))
  if (!/^\+?[1-9][0-9]*$/.test(value)) return callback(new Error('请输入非零正整数'))
  callback()
}


