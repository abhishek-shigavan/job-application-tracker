import { useDroppable } from "@dnd-kit/core"

function DroppableColumn ({ children, id }) {
    const { setNodeRef } = useDroppable({ id })
    
    return (
        <div ref={setNodeRef}>
            {children}
        </div>
    )
}

export default DroppableColumn
