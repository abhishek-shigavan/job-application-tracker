import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import AddJob from "../AddJob/AddJob"
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import Popper from '@mui/material/Popper'
import { useAuth } from "../../hooks/useAuth"
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from "../../firebase"
import "./HeaderOutletContainer.scss"

function HeaderOutletContainer () {
    const { user } = useAuth()
    const [userDetails, setUserDetails] = useState(null)
    const [openAddJob, setOpenAddJob] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const navigate = useNavigate()

    const [jobsList, setJobsList] = useState([])
    const [loading, setLoading] = useState(true)
    const [noData, setNoData] = useState(false)

    useEffect(() => {
        let userData = localStorage.getItem("userDetails")
        setUserDetails(JSON.parse(userData))
    }, [])

    useEffect(() => {
        if (!user) {
            return
        }
        const q = query(
            collection(db, 'jobs'),
            where('owner', '==', user?.uid)
        )
    
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const jobsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setLoading(false)
            if(jobsData?.length) {
                setJobsList(jobsData) 
            } else {
                setNoData(true)
            }
        })
    
        return () => unsubscribe()
    }, [user])

    const handleModalOpen = () => setOpenAddJob(true)
    const handleModalClose = () => setOpenAddJob(false)

    const handleLogout = () => {
        localStorage.removeItem("userDetails")
        setAnchorEl(null)
        navigate("/")
    }

    return (
        <div className="header-outlet-main-cnt">
            <div className="header-main-cnt">
                <Button variant="outlined" sx={{width: "fit-content !important", padding: "5px 20px !important"}} onClick={handleModalOpen}>Add Job</Button>
                <div className="header-avatar-cnt" onClick={(e) => anchorEl ? setAnchorEl(null) : setAnchorEl(e.currentTarget)}>
                    <span>{userDetails?.displayName.charAt(0)}</span>
                </div>
                <Popper open={open} anchorEl={anchorEl} className="header-profile-menu-cnt">
                    <span>{userDetails?.displayName}</span>
                    <span>{userDetails?.email}</span>
                    <Button variant="outlined" sx={{width: "fit-content !important", padding: "5px 20px !important"}} onClick={handleLogout}>Logout</Button>
                </Popper>
            </div>
            <div className="outlet-cnt">
                <Outlet context={{ jobsList, loading, noData, setJobsList }} />
            </div>
            <Modal open={openAddJob} onClose={handleModalClose} sx={{height: "100vh", display: "flex"}}>
                <AddJob closeAddJob={handleModalClose} />
            </Modal>
        </div>
    )
}

export default HeaderOutletContainer
