import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
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
          } finally {
            // setLoading(false)
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
            // alert('Job updated successfully')
            // setEditing(false)
        } catch (err) {
            console.error('Error updating job:', err)
        }
    } 

    return (
        <>
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
            <h1>JobDetails</h1>
            {jobDetails &&
                <div className="job-details-card-cnt">
                    <TextField 
                        label="Role"
                        variant="outlined"
                        value={jobDetails.title}
                        onChange={(e) => handleJobDetails({title: e.target.value})}
                    />
                    <TextField 
                        label="Company"
                        variant="outlined"
                        value={jobDetails.company}
                        onChange={(e) => handleJobDetails({company: e.target.value})}
                    />
                    {/* <FormControl fullWidth> */}
                        <Select
                            value={jobDetails.status}
                            // label="Status"
                            onChange={handleStatus}
                        >
                            <MenuItem value={"Applied"}>Applied</MenuItem>
                            <MenuItem value={"Interview"}>Interview</MenuItem>
                            <MenuItem value={"Offer"}>Offer</MenuItem>
                            <MenuItem value={"Hired"}>Hired</MenuItem>
                            <MenuItem value={"Rejected"}>Rejected</MenuItem>
                        </Select>
                    {/* </FormControl> */}
                    <TextField 
                        label="Notes"
                        variant="outlined"
                        value={jobDetails.notes}
                        onChange={(e) => handleJobDetails({notes: e.target.value})}
                    />
                    <button>Edit</button>
                    <button onClick={handleUpdate}>Update</button>
                </div> 
            }
        </>
    )
}

export default JobDetails
