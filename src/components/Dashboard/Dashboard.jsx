import { useEffect, useState } from "react"
import AddJob from "../AddJob/AddJob"
import Modal from '@mui/material/Modal'
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore'
import { db } from "../../firebase"
import { useAuth } from "../../useAuth"
import JobCard from "../JobCard/JobCard"
import {
    arrayMove,
    SortableContext,
    rectSortingStrategy,
} from '@dnd-kit/sortable'
import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import DroppableColumn from "../DNDComponent/DroppableColumn"
import { useNavigate } from "react-router-dom"
import Button from '@mui/material/Button'
import "./Dashboard.scss"

const STATUSES = ['Applied', 'Interview', 'Offer', 'Hired', 'Rejected']

function Dashboard () {
    const { user } = useAuth()
    const navigate = useNavigate()
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

    const handleLogout = () => {
        navigate("/")
    }

    return (
        <div className="dashboard-main-cnt">
            <div className="dashboard-header-cnt">
                <Button variant="outlined" sx={{width: "fit-content !important", padding: "5px 20px !important"}} onClick={handleModalOpen}>Add Job</Button>
                <Button variant="outlined" sx={{width: "fit-content !important", padding: "5px 20px !important", margin: "20px !important"}} onClick={handleLogout}>Logout</Button>
            </div>
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
                                <>
                                    <h3>{status}</h3>
                                    <span>{jobsList.filter(job => job.status === status).length}</span>
                                </>
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
            <Modal open={openAddJob} onClose={handleModalClose} sx={{height: "100vh", display: "flex"}}>
                <AddJob closeAddJob={handleModalClose} />
            </Modal>
        </div>
    )
}

export default Dashboard
