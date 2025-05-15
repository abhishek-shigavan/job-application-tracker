import { useEffect, useState } from "react"
import AddJob from "../AddJob/AddJob"
import Modal from '@mui/material/Modal'
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore'
import { db } from "../../firebase"
import { useAuth } from "../../useAuth"
import JobCard from "../JobCard/JobCard"
import "./Dashboard.scss"
import {
    arrayMove,
    SortableContext,
    rectSortingStrategy,
} from '@dnd-kit/sortable'
import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import SortableJobCard from "../DNDComponent/SortableJobCard"
import DroppableColumn from "../../DroppableColumn"

const STATUSES = ['Applied', 'Interview', 'Offer', 'Hired', 'Rejected']

function Dashboard () {
    const { user } = useAuth()
    const [jobsList, setJobsList] = useState([])
    const [openAddJob, setOpenAddJob] = useState(false)

    const [activeId, setActiveId] = useState(null)
    const sensors = useSensors(useSensor(PointerSensor))


    useEffect(() => {
        if (!user) return;
    
        const q = query(
            collection(db, 'jobs'),
            where('owner', '==', user?.uid)
        )
    
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const jobsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            console.log(jobsData);
            
            setJobsList(jobsData)
        })
    
        return () => unsubscribe()
    }, [user])

    const handleModalOpen = () => setOpenAddJob(true)
    const handleModalClose = () => setOpenAddJob(false)

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
            <h1>Dashboard</h1>
            <button onClick={handleModalOpen}>Add job</button>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="dashboard-jobs-pannel-cnt" style={{ display: 'flex', gap: '1rem' }}>
                    {STATUSES.map(status => (
                        <DroppableColumn id={status} key={status}>
                            <div
                                id={status}
                                key={status}
                                style={{ border: '1px solid #ccc', padding: '1rem', width: '250px', minHeight: '300px' }}
                            >
                                <h3>{status}</h3>
                                <SortableContext
                                    items={jobsList.filter(job => job.status === status).map(job => job.id)}
                                    strategy={rectSortingStrategy}
                                >
                                    {jobsList.filter(job => job.status === status).map(job => (
                                        <SortableJobCard key={job.id} jobDetails={job} />
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
            <Modal open={openAddJob} onClose={handleModalClose}>
                <AddJob closeAddJob={handleModalClose} />
            </Modal>
        </div>
    )
}

export default Dashboard
