import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import "./JobDetails.scss"

function JobDetails () {
    const { jobId } = useParams()
    const navigate = useNavigate()
    const [jobDetails, setJobDetails] = useState()

    useEffect(() => {
        const fetchJob = async () => {
          try {
            const docRef = doc(db, 'jobs', jobId)
            const docSnap = await getDoc(docRef)
    
            if (docSnap.exists()) {
              setJobDetails({ id: docSnap.id, ...docSnap.data() })
            } else {
              console.log('No such job')
            }
          } catch (err) {
            console.error('Error fetching job:', err)
          }
        }
    
        fetchJob()
    }, [jobId])

    const handleJobDetails = (updatedData) => {
        setJobDetails({...jobDetails, ...updatedData})
    }

    const handleStatus = (e) => {
        setJobDetails({...jobDetails, status: e.target.value })
    }

    const handleUpdate = async() => {
        try {
            const docRef = doc(db, 'jobs', jobId)
            await updateDoc(docRef, {
              title: jobDetails.title,
              company: jobDetails.company,
              status: jobDetails.status,
              notes: jobDetails.notes
            })
            navigate("/dashboard")
        } catch (err) {
            console.error('Error updating job:', err)
        }
    } 

    return (
        <div className="job-details-main-cnt">
            <Button variant="outlined" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
            <div className="job-details-title-chip">
                <span>Job Details</span>
            </div>
            <div className="job-details-divider-cnt"></div>
            {jobDetails &&
                <div className="job-details-card-cnt">
                    <TextField 
                        label="Role"
                        variant="outlined"
                        value={jobDetails.title}
                        onChange={(e) => handleJobDetails({title: e.target.value})}
                        fullWidth
                    />
                    <TextField 
                        label="Company"
                        variant="outlined"
                        value={jobDetails.company}
                        onChange={(e) => handleJobDetails({company: e.target.value})}
                        fullWidth
                    />
                    <Select
                        value={jobDetails.status}
                        onChange={handleStatus}
                        fullWidth
                    >
                        <MenuItem value={"Applied"}>Applied</MenuItem>
                        <MenuItem value={"Interview"}>Interview</MenuItem>
                        <MenuItem value={"Offer"}>Offer</MenuItem>
                        <MenuItem value={"Hired"}>Hired</MenuItem>
                        <MenuItem value={"Rejected"}>Rejected</MenuItem>
                    </Select>
                    <TextField 
                        label="Notes"
                        variant="outlined"
                        value={jobDetails.notes}
                        onChange={(e) => handleJobDetails({notes: e.target.value})}
                        fullWidth
                    />
                    <Button variant="outlined" sx={{width: "fit-content !important", padding: "10px 20px !important"}} onClick={handleUpdate}>Update</Button>
                </div> 
            }
        </div>
    )
}

export default JobDetails
