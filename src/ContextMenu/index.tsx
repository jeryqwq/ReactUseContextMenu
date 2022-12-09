import { MouseEvent } from 'react';
import './index.less';
import Item from './Item';
import SubMenu from './SubMenu';
import useContextMenu from './useContextMenu';
export declare type ContextMenuItem = {
  /** 唯一值 */
  value: string;
  /** 展示的名称或者自定义jsx */
  label: React.ReactNode;
  /** 子节点加载方法或者子节点数组 */
  children?: ContextMenuItem[] | ((item: ContextMenuItem) => ContextMenuItem[] );
  /** 图表 */
  icon?: React.ReactNode;
  /** 是否禁用，禁用后不会处罚单击函数 */
  disabled?: boolean;
  /** 自定义渲染 */
  render?: (_: ContextMenuItem) => React.ReactNode;
  /** 自定义加载图表 */
  loadding?: React.ReactNode;
};

export type HandleClick = (e: MouseEvent<HTMLLIElement, any>, item: ContextMenuItem & { target: HTMLElement }, menu: ContextMenuItem) => void

type ContextMenuProps = {
  /** 菜单数据 */
  menus: Array<ContextMenuItem>;
  onClick: HandleClick;
  /** 当前Trigger触发的数据项 */
  curItem: React.MutableRefObject<ContextMenuItem | undefined>;
  /** 递归深度 */
  depth?: number;
  /** 
   * Save the parameter layout of each item, 
   * When rendering to the next layer, check whether it can be expanded  
   * */
  prevRects?: Array<() => HTMLUListElement>;
    /** 自定义加载图表 */
  loadding?: React.ReactNode;
};

export const prefixCls = 'vis-comp-context-menu-'

const ContextMenu = function (props: ContextMenuProps) {
  const {
    onClick,
    menus,
    curItem,
    prevRects = [],
    depth = 0,
    loadding
  } = props
  return <SubMenu {...props} depth={ depth } prevRects={prevRects}>
    {
      menus.map(i => <Item loadding={loadding} item={i} curData={ curItem } onClick={onClick} prevRects={prevRects} depth={depth + 1}/>)
    }
  </SubMenu>
}

ContextMenu.Item = Item

ContextMenu.useContextMenu = useContextMenu

export default ContextMenu

export const ContextMenuItem = (_: ContextMenuItem) => <></>
