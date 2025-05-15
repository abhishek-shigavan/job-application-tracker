import { useEffect, useState } from "react"
import AddJob from "../AddJob/AddJob"
import Modal from '@mui/material/Modal'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from "../../firebase"
import { useAuth } from "../../useAuth"
import JobCard from "../JobCard/JobCard"
import "./Dashboard.scss"

function Dashboard () {
    const { user } = useAuth()
    const [jobsList, setJobsList] = useState([])
    const [openAddJob, setOpenAddJob] = useState(false)

    useEffect(() => {
        console.log(user);
        
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
          console.log(jobsData)
          
          setJobsList(jobsData)
        })
    
        return () => unsubscribe()
    }, [user])

    const handleModalOpen = () => setOpenAddJob(true)
    const handleModalClose = () => setOpenAddJob(false)

    return (
        <div className="dashboard-main-cnt">
            <h1>Dashboard</h1>
            <button onClick={handleModalOpen}>Add job</button>
            <div className="dashboard-jobs-pannel-cnt">
                <div className="dashboard-applied-jobs-cnt">
                    {jobsList.filter(job => job.status === "Applied").map(job => <JobCard key={job?.id} jobDetails={job}/>)}
                </div>
                <div className="dashboard-interview-jobs-cnt">
                    {jobsList.filter(job => job.status === "Interview").map(job => <JobCard key={job?.id} jobDetails={job}/>)}
                </div>
                <div className="dashboard-offer-jobs-cnt">
                    {jobsList.filter(job => job.status === "Offer").map(job => <JobCard key={job?.id} jobDetails={job}/>)}
                </div>
                <div className="dashboard-hired-jobs-cnt">
                    {jobsList.filter(job => job.status === "Hired").map(job => <JobCard key={job?.id} jobDetails={job}/>)}
                </div>
                <div className="dashboard-rejected-jobs-cnt">
                    {jobsList.filter(job => job.status === "Rejected").map(job => <JobCard key={job?.id} jobDetails={job}/>)}
                </div>
            </div>
            <Modal
                open={openAddJob}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <AddJob closeAddJob={handleModalClose} />
            </Modal>
        </div>
    )
}

export default Dashboard
