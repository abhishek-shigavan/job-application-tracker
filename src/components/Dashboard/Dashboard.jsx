import { useEffect, useState } from "react"
import AddJob from "../AddJob/AddJob"
import Modal from '@mui/material/Modal'
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore'
import { db } from "../../firebase"
import { useAuth } from "../../useAuth"
import JobCard from "../JobCard/JobCard"
import {
    SortableContext,
    rectSortingStrategy,
} from '@dnd-kit/sortable'
import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import DroppableColumn from "../DNDComponent/DroppableColumn"
import { useNavigate } from "react-router-dom"
import Button from '@mui/material/Button'
import Popper from '@mui/material/Popper'
import "./Dashboard.scss"

const STATUSES = ['Applied', 'Interview', 'Offer', 'Hired', 'Rejected']

function Dashboard () {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [jobsList, setJobsList] = useState([])
    const [openAddJob, setOpenAddJob] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const [userDetails, setUserDetails] = useState(null)
    const [activeId, setActiveId] = useState(null)
    const sensors = useSensors(useSensor(PointerSensor))
    const open = Boolean(anchorEl)

    useEffect(() => {
        let userData = localStorage.getItem("userDetails")
        setUserDetails(JSON.parse(userData))
    }, [])

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
        localStorage.removeItem("userDetails")
        setAnchorEl(null)
        navigate("/")
    }

    return (
        <div className="dashboard-main-cnt">
            <div className="dashboard-header-cnt">
                <Button variant="outlined" sx={{width: "fit-content !important", padding: "5px 20px !important"}} onClick={handleModalOpen}>Add Job</Button>
                <div className="dashboard-header-avatar-cnt" onClick={(e) => anchorEl ? setAnchorEl(null) : setAnchorEl(e.currentTarget)}>
                    <span>{userDetails?.displayName.charAt(0)}</span>
                </div>
                <Popper open={open} anchorEl={anchorEl} className="dashboard-profile-menu-cnt">
                    <span>{userDetails?.displayName}</span>
                    <span>{userDetails?.email}</span>
                    <Button variant="outlined" sx={{width: "fit-content !important", padding: "5px 20px !important"}} onClick={handleLogout}>Logout</Button>
                </Popper>
            </div>
            <DndContext
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
            <Modal open={openAddJob} onClose={handleModalClose} sx={{height: "100vh", display: "flex"}}>
                <AddJob closeAddJob={handleModalClose} />
            </Modal>
        </div>
    )
}

export default Dashboard