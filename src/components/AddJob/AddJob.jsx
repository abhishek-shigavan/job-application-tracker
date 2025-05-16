import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "../../firebase"
import { useAuth } from "../../hooks/useAuth"
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import { useState } from "react"
import "./AddJob.scss"

function AddJob ({closeAddJob}) {
    const { user } = useAuth()
    const [jobDetails, setJobDetails] = useState({
        title: "",
        company: "",
        status: "Applied",
        notes: "",
        logoURL: ''
    })

    const handleJobDetails = (updatedData) => setJobDetails({...jobDetails, ...updatedData})

    const handleStatus = (e) => setJobDetails({...jobDetails, status: e.target.value })

    const handleAddJob = async() => {
        try {
            await addDoc(collection(db, 'jobs'), {
                ...jobDetails,
                owner: user.uid,
                createdAt: serverTimestamp()
            })
        } catch (error) {
            console.error('Error adding job:', error)
        }
        closeAddJob()
    }

    return (
        <div className="add-job-inner-cnt">
            <TextField
                label="Role"
                variant="outlined"
                fullWidth
                onChange={(e) => handleJobDetails({title: e.target.value})}
            />
            <TextField
                label="Company"
                variant="outlined"
                fullWidth
                onChange={(e) => handleJobDetails({company: e.target.value})}
            />
            <Select
                fullWidth
                value={jobDetails.status}
                onChange={handleStatus}
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
                fullWidth
                multiline={4}
                onChange={(e) => handleJobDetails({notes: e.target.value})}
            />
            <Button variant="outlined" sx={{width: "fit-content !important", padding: "10px 20px !important"}} onClick={handleAddJob}>Save</Button>
        </div>
    )
}

export default AddJob
