// @flow

export type HrStateDesc<T> = {
  loading: boolean,
  hasError: boolean,
  error: ?any,
  value: T,
  loadingStartTime: number,
  loadingCompleteTime: number,
  userMeta: Object,
}

export type HrStateById = { [type: string]: { [id: string]: HrStateDesc<any> } };
export type HrStateList = { [type: string]: HrStateDesc<Array<any>> };
export type HrStateKv = { [type: string]: { [id: string]: HrStateDesc<any> } };

export type HrState = {
  isHrState: true,
  byId: HrStateById,
  lists: HrStateList,
  kv: HrStateKv,
  // TODO: implement this in some way
  // receipts: { [key: string]: any },
}
