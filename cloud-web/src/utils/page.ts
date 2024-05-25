/**
 * table查询数据格式化
 * @param params 查询参数
 * @param sort 排序参数
 */
export function getParams(params: any, sort: any): any {
    function getOrder(obj: any): any {
        for (const key in obj) {
            const temp = {
                order_by_field: key
            };
            if (obj[key] == "ascend") {
                // @ts-ignore
                temp.order_by_type = "asc"
            } else {
                // @ts-ignore
                temp.order_by_type = "desc"
            }
            return temp;
        }
        return {};
    }

    params.page = params.current;
    params.page_size = params.pageSize;
    delete params.current;
    delete params.pageSize;
    return Object.assign(params, getOrder(sort));
}
