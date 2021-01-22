import React, { useCallback, useState } from 'react'
import Item from './Item'

export type ItemType = {
  title: string
  key: string
  children?: ItemType[]
}

const MOCK_DATA: ItemType[] = [
  {
    title: 'Rashawn',
    key: '21343',
    children: [
      {
        title: 'Agustin',
        key: '48515'
      },
      {
        title: 'Lavon',
        key: '65522'
      },
      {
        title: 'Norbert',
        key: '43162'
      }
    ]
  },
  {
    title: 'Johnson',
    key: '9546'
  },
  {
    title: 'Myrna',
    key: '86247'
  },
  {
    title: 'Demarcus',
    key: '7275'
  },
  {
    title: 'Mafalda',
    key: '10642'
  },
  {
    title: 'Merritt',
    key: '19527'
  }
]

export default () => {
  const [dataList, setDataList] = useState<ItemType[]>(MOCK_DATA)

  const moveField = useCallback(
    (dragIndex: number, hoverIndex: number, cb?: () => void) => {
      const dataListCopy = [...dataList]

      const fieldBeingDragged = dataListCopy[dragIndex]
      dataListCopy[dragIndex] = dataListCopy[hoverIndex]
      dataListCopy[hoverIndex] = fieldBeingDragged

      setDataList(dataListCopy)

      cb && cb()
    },
    [dataList]
  )

  return (
    <div className="list-container">
      {dataList.map((each, index) => (
        <Item
          data={each}
          key={each.key}
          index={index}
          type="field"
          moveField={moveField}
        />
      ))}
    </div>
  )
}
