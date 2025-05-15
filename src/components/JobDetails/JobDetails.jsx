import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'

function JobDetails () {
    const { jobId } = useParams()
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

    return (
        <>
            <h1>JobDetails</h1>
            {jobDetails &&
            <div className="job-details-card-cnt">
            <span>{jobId}</span>
            <span>{jobDetails?.title}</span>
            <span>{jobDetails?.status}</span>
            <button>Edit</button>
            <button>Update</button>
            </div> 
            }
        </>
    )
}

export default JobDetails
