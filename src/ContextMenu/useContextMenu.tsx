import React from "react";
import { createRef, useLayoutEffect, useRef, useState } from "react";
import ContextMenu, { ContextMenuItem, HandleClick } from './index'



export type TriggerProps = { 
  /** 该属性的子节点 */
  children: React.ReactNode;
  /** 需要传递给菜单的数据 */
  data: any;
  /** 如果是其它元素，可用此方法绑定任意触发器 */
  getEl?: () => HTMLDivElement;
  /** 外层的css样式 */
  style?: React.CSSProperties;
  /** 
   * @description 渲染Trigger的标签，用来适配一些其它框架
   * @default div
   *  */
  tag?: string;
}

declare type ContextMenuProps = {
  /** 菜单数据 */
  menus: ContextMenuItem[];
  /** 单击处理函数 ，分别是 event, data(触发器数据), node(菜单)*/
  onClick: HandleClick;
  /** 自定义加载图表 */
  loadding?: React.ReactNode;
}

declare type HooksProps = {
    /** 
   * @description w3c规范的所有的事件字符串内容
   * @default contextmenu
   */
    event?: keyof HTMLElementEventMap;
}
export default (hooksProps : HooksProps) => {
  const { event = 'contextmenu' } = hooksProps || {}
  const curItem = useRef<ContextMenuItem>()
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [menuVisible, setMenuVisible] = useState(false)

  return {
    Trigger: ({ children, data, getEl, style, tag = 'div', ...ohters }: TriggerProps) => {
      const el = createRef<HTMLDivElement>()
      useLayoutEffect(() => {
        const contextMenuHandle = function (e: MouseEvent) {
          e.preventDefault()
          curItem.current = data
          setPosition({
            x: e.clientX,
            y: e.clientY
          })
          setMenuVisible(true)
        }
        const trigger = getEl?.() || el.current;
        trigger?.addEventListener(event, contextMenuHandle as any)
        return () => {
          trigger?.removeEventListener(event, contextMenuHandle as any)
        }
      }, [])
      return React.createElement(tag, {
        ...ohters,
        ref: el,
        style,
      }, children)
    },
    ContextMenu: ({
      menus,
      onClick = () => {},
      loadding = <span></span>
    }: ContextMenuProps) => {
      useLayoutEffect(() => {
        const hideMenu = function () {
          setTimeout(() => {
           setMenuVisible(false);
          }, 0);
         }
        event !== 'click' && document.body.addEventListener('click', hideMenu)
        return () => {
          event !== 'click' && document.body.removeEventListener('click', hideMenu)
        }
      }, [])
      return <div
        tabIndex={0}
        onClick={() => {
          setMenuVisible(false)
        }}
        style={{
          left: position.x ?? 0,
          top: position.y ?? 0,
          display: menuVisible ? 'block' : 'none',
          position: 'fixed',
          zIndex: '999'
        }}>
          <ContextMenu
            menus={menus}
            onClick={onClick}
            curItem={curItem}
            loadding={loadding}
          />
        </div>
    }
  }
}

export const ContextMenuProps = (_: ContextMenuProps) => <></>

export const TriggerProps = (_: TriggerProps) => <></>

export const HooksProps = (_: HooksProps) => <></>
