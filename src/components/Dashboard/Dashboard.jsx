import { useState } from "react"
import { updateDoc, doc } from 'firebase/firestore'
import { db } from "../../firebase"
import JobCard from "../JobCard/JobCard"
import {
    SortableContext,
    rectSortingStrategy,
} from '@dnd-kit/sortable'
import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import DroppableColumn from "../DNDComponent/DroppableColumn"
import CircularProgress from '@mui/material/CircularProgress'
import "./Dashboard.scss"
import { useOutletContext } from "react-router-dom"

const STATUSES = ['Applied', 'Interview', 'Offer', 'Hired', 'Rejected']

function Dashboard () {
    const { jobsList, loading, noData } = useOutletContext()
    const [activeId, setActiveId] = useState(null)
    const sensors = useSensors(useSensor(PointerSensor))

    const handleDragStart = (event) => {
        setActiveId(event.active.id)
    }
    
    const handleDragEnd = async (event) => {
        const { active, over } = event
        if (!over) return

        const newStatus = over.id
        const activeJob = jobsList.find(job => job.id === active.id)

        if (activeJob && activeJob.status !== newStatus && STATUSES.includes(newStatus)) {
            await updateDoc(doc(db, 'jobs', active.id), {
                status: newStatus
            })
        }
        setActiveId(null)
    }

    return (
        <div className="dashboard-main-cnt">
            {loading ? <div className="dashboard-loader-msg-cnt">
                    <CircularProgress/>
                </div> 
                : noData ? <div className="dashboard-loader-msg-cnt"><span>No jobs found.</span></div>
                : <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="dashboard-jobs-pannel-cnt">
                        {STATUSES.map(status => (
                            <DroppableColumn id={status} key={status}>
                                <div
                                    id={status}
                                    key={status}
                                    className="dashboard-jobs-pannel-col-cnt"
                                >
                                    <div className="dashboard-jobs-pannel-col-header">
                                        <span>{status}</span>
                                        <div className="dashboard-jobs-pannel-col-counter">
                                            <span>{jobsList.filter(job => job.status === status).length}</span>
                                        </div>
                                    </div>
                                    <SortableContext
                                        items={jobsList.filter(job => job.status === status).map(job => job.id)}
                                        strategy={rectSortingStrategy}
                                    >
                                        {jobsList.filter(job => job.status === status).map(job => (
                                            <JobCard key={job.id} jobDetails={job} />
                                        ))}
                                    </SortableContext>
                                </div>
                            </DroppableColumn>
                        ))}
                    </div>
                    <DragOverlay>
                        {activeId ? 
                            <JobCard jobDetails={jobsList.find(job => job.id === activeId)} />
                            : null}
                    </DragOverlay>
                </DndContext>
            }
        </div>
    )
}

export default Dashboard