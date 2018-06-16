// @flow
'use strict';

import type HrQuery from './HrQuery';

export function getKey(key: ?string) {
  if (!key) return '[[default]]';
  return key;
}

export type HrStateDesc<T> = {
  loading: boolean,
  hasError: boolean,
  error: ?any,
  value: T,
  loadingStartTime: number,
  loadingCompleteTime: number,
  etc: Object,
}

export type PathType = 'id' | 'list' | 'kv';
export type OpType = 'setIds' | 'mergeIds' | 'updateInDesc' | 'deleteDesc' | 'listOp' | 'clearOptimistic' | 'mergeDesc';

export type HrStateWrapperOp = {
  op: OpType,
  data: any,
  type: ?PathType,
  typeValue: string | null,
  key: ?string,
  optimisticId: ?string,
};

export type HrStateById = { [type: string]: { [id: string]: HrStateDesc<any> } };
export type HrStateList = { [type: string]: HrStateDesc<Array<any>> };
export type HrStateKv = { [type: string]: { [id: string]: HrStateDesc<any> } };
export type RollbackOp = HrStateWrapperOp;
export type RollbackOps = { [id: string]: Array<RollbackOp> };

export type HrState = {
  isHrState: true,
  byId: HrStateById,
  lists: HrStateList,
  kv: HrStateKv,
  rollbackOps: RollbackOps,
}


export type SelectorFunc = (query: HrQuery, state: Object) => any
export type SelectorMapping = { [selectorName: string]: SelectorFunc }

export type SubscribeDescriptor = {
  handler: (selfState: Object, ownProps: Object, dispatch: Function, state: ?Object) => mixed,
  needsState?: boolean,
}
