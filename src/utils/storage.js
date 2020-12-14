/**
 * 存储的本地数据（持久化）
 */
export const getItem = name => {
  const data = window.localStorage.getItem(name)
  try {
    // data 是 obj 对象
    return JSON.parse(data)
  } catch (err) {
    // data 不是 obj 对象，直接返回字符串
    return data
  }
}

export const setItem = (name, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  return window.localStorage.setItem(name, value)
}

export const removeItem = name => {
  return window.localStorage.removeItem(name)
}
