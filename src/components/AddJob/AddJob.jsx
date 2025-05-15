import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "../../firebase"
import { useAuth } from "../../useAuth"

function AddJob ({closeAddJob}) {
    const { user } = useAuth()

    const handleAddJob = async() => {
        const formData = {
            title: 'Frontend Developer',
            company: 'Zxxzv',
            logoURL: '',
            status: 'Applied',
            notes: ''
        }
        
        try {
            await addDoc(collection(db, 'jobs'), {
              ...formData,
              owner: user.uid,
              createdAt: serverTimestamp()
            })
        } catch (error) {
            console.error('Error adding job:', error)
        }

        closeAddJob()
    }

    return (
        <>
            <h1>AddJob</h1>
            <button onClick={handleAddJob}>Save</button>
        </>
    )
}

export default AddJob
