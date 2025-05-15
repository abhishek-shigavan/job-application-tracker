import { useNavigate } from "react-router-dom"
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Button from '@mui/material/Button'
import "./JobCard.scss"

function JobCard ({ jobDetails }) {
    const jobCreatedAt = new Date(jobDetails?.createdAt?.seconds * 1000).toLocaleDateString()
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: jobDetails.id })
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    const navigate = useNavigate()

    const handleJobCard = () => {
        navigate(`/job/${jobDetails.id}`)
    }

    return (
        <div ref={setNodeRef} style={style} className="job-card-cnt">
            <div {...attributes} {...listeners} className="job-card-details-cnt">
                <span>{jobDetails?.title}</span>
                <span>{jobDetails?.company}</span>
                <span>{jobDetails?.status}</span>
                <span>Applied at {jobCreatedAt}</span>
            </div>
            <Button variant="outlined" sx={{width: "fit-content !important", padding: "5px 20px !important"}} onClick={handleJobCard}>See Details</Button>
        </div>
    )
}

export default JobCard
