import React, { Children, createRef, useLayoutEffect, useState } from "react";
import { compareShapeLocation } from "./helper";
import { prefixCls } from "./index";

declare type SubMenuProps = {
  children: React.ReactNode;
  depth: number;
  prevRects: Array<() => HTMLUListElement>;
}

/**
 * 
 * @param SubMenuProps 
 * @description 负责根据渲染路径计算布局冲突， 进行位置调和
 */

export default function (props : SubMenuProps) {
  const { children, prevRects, depth } = props
  const [_layout, setLayout] = useState<React.CSSProperties>({ position: 'absolute', left: '100%', top: '0' })
  const rectRef = createRef<HTMLUListElement>()
  prevRects[depth] = () => rectRef.current as HTMLUListElement
  useLayoutEffect(() => {
    const rect = rectRef.current?.getBoundingClientRect()
    // 是否需要解决冲突
    const res = rect && compareShapeLocation(rect)
    let layout: React.CSSProperties = { transform : ''}
    if(res?.right) { // 右侧无法展示， 移到最左侧展示 
      let moveX = 0
      prevRects.forEach((i, idx) => {
        if(idx !== prevRects.length -1 ) {
          moveX += (i?.()?.getBoundingClientRect().width) || 0
        }
      })
      layout.transform += `translateX(calc( -100% - ${moveX}px ))`
    }
    if(res?.bottom) {
      layout.transform += `translateY(-${res.bottom}px )`
    }
    setLayout({..._layout, ...layout})
  }, [])
  return (
    <ul
      className={prefixCls + 'wrap'} 
      style={_layout}
      ref={rectRef}
    >
      {
        Children.map(children, (child) => React.cloneElement(child as any, { prevRects }))
      }
    </ul>
  )
}
