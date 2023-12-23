/**
 * if a ColumnMeta is link type, show the link info
 * @date 2023/11/29 - 09:50:00
 * @author Mr_Spade
 *
 * @export
 * @interface LinkBody
 * @typedef {LinkBody}
 */
export interface LinkBody {
  head: string
  idName: string
}
// TODO: remove deprecated linkbody

import { type RouteLocationRaw } from 'vue-router'

/**
 * meta info of a FormTable's column
 * @date 2023/11/29 - 09:48:01
 * @author Mr_Spade
 *
 * @export
 * @interface ColumnMeta
 * @typedef {ColumnMeta}
 */
export interface ColumnMeta {
  name: string
  showName?: string
  sortable: boolean
  type?: string
  linkbody?: LinkBody
  linkCallback?: (scope: any) => RouteLocationRaw
}
