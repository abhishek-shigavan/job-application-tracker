import { useNavigate } from "react-router-dom"
import "./JobCard.scss"

function JobCard ({jobDetails}) {
    const navigate = useNavigate()

    const handleJobCard = () => {
        navigate(`/job/${jobDetails.id}`)
    }
    
    return (
        <div className="job-card-cnt" onClick={handleJobCard}>
            <span>{jobDetails?.title}</span>
            <span>{jobDetails?.status}</span>
        </div>
    )
}

export default JobCard
