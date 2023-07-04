/**
 * 获取树状数据(无限级)
 * @param data 数据
 * @param pid 父级id
 * @param name 主键名称
 * @param parentName 父级主键名称
 * @param childrenName 子集名称
 * @param callback 回调函数
 */
export function toTreeData(data: any, pid: any, name: string, parentName: string, childrenName: string, callback: Function = (item: any): any => {
  return item;
}): any {
  function tree(id: any) {
    let arr: any = []
    data.filter((item: any) => {
      return item[parentName] === id;
    }).forEach((item: any) => {
      let temp = item
      temp[childrenName] = tree(item[name])
      if (callback != undefined) {
        temp = callback(temp)
      }
      arr.push(temp)
    })
    return arr
  }

  return tree(pid)
}

/**
 * 获取tree数据
 * @param data 数据
 * @param name 子集名称
 * @param callback 回调函数
 */
export function getTreeData(data: any, name: string, callback: Function = (item: any): any => {
  return item;
}): any {
  let temp: any[] = [];

  function tree(data: any) {
    data.forEach((item: any) => {
      item = callback(item);
      if (item != undefined) {
        if (item[name] != undefined && item[name].length > 0) {
          tree(item[name])
        }
        delete item[name];
        temp.push(item)
      }
    })
  }

  tree(data)
  return temp.reverse()
}
