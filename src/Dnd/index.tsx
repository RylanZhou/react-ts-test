import React from 'react'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import TreeList from './TreeList'

export default () => {
  return (
    <div className="dnd">
      <DndProvider backend={HTML5Backend}>
        <TreeList />
      </DndProvider>
    </div>
  )
}
