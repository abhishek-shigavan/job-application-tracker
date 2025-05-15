import { useEffect, useState } from "react"
import AddJob from "../AddJob/AddJob"
import Modal from '@mui/material/Modal'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from "../../firebase"
import { useAuth } from "../../useAuth"

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
        <>
            <h1>Dashboard</h1>
            <button onClick={handleModalOpen}>Add job</button>
            <Modal
                open={openAddJob}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <AddJob closeAddJob={handleModalClose} />
            </Modal>
        </>
    )
}

export default Dashboard
