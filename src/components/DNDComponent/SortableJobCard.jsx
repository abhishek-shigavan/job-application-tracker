import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import JobCard from '../JobCard/JobCard'

function SortableJobCard ({ jobDetails }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: jobDetails.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <JobCard jobDetails={jobDetails} />
        </div>
    )
}

export default SortableJobCard
