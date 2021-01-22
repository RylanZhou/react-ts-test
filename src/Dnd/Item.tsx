import React, { useCallback, useEffect, useRef, useState } from 'react'
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from 'react-dnd'
import { ItemType } from './TreeList'

type ItemProps = {
  data: ItemType
  index: number
  type: string
  moveField: (dragIndex: number, hoverIndex: number, cb?: () => void) => void
}

type DragItemType = {
  index: number
  id: number
  type: string
}

const Item = (props: ItemProps) => {
  const [childrenList, setChildrenList] = useState<ItemType[]>([])
  const [forbidDrag, setForbidDrag] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (props.data.children) {
      setChildrenList(props.data.children)
    }
  }, [props.data])

  const [{ isDragging }, drag] = useDrag({
    item: { type: props.type, id: props.data.key, index: props.index },
    canDrag: !forbidDrag,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  const [, drop] = useDrop({
    accept: props.type,
    hover: (item: DragItemType, monitor: DropTargetMonitor) => {
      if (!ref.current) {
        return
      }

      const dragIndex = item.index
      const hoverIndex = props.index

      if (dragIndex === hoverIndex) return

      /* Fix jittering problem -- START */
      const { bottom, top } = ref.current.getBoundingClientRect()
      const rectMiddleY = (bottom - top) / 2
      const clientY = (monitor.getClientOffset() as XYCoord).y - top

      if (
        (dragIndex < hoverIndex && clientY < rectMiddleY) ||
        (dragIndex > hoverIndex && clientY > rectMiddleY)
      ) {
        return
      }
      /* Fix jittering problem -- END */

      props.moveField(dragIndex, hoverIndex, () => {
        item.index = hoverIndex
      })
    }
  })

  // If current field is a loop, sub-fields inside it will trigger this function for arrangement
  const moveField = useCallback(
    (dragIndex: number, hoverIndex: number, cb?: () => void) => {
      const dataListCopy = [...childrenList]

      const fieldBeingDragged = dataListCopy[dragIndex]
      dataListCopy[dragIndex] = dataListCopy[hoverIndex]
      dataListCopy[hoverIndex] = fieldBeingDragged

      cb && cb()
      setChildrenList(dataListCopy)
    },
    [childrenList]
  )

  drag(drop(ref))

  return (
    <div className="item" ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {props.data.children ? (
        <div>
          {childrenList.map((each, index) => (
            <Item
              key={each.key}
              index={index}
              data={each}
              type="loop-field"
              moveField={moveField}
            />
          ))}
        </div>
      ) : (
        <span>{props.data.title}</span>
      )}
    </div>
  )
}

export default Item
