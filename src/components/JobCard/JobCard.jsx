function JobCard ({jobDetails}) {
    return (
        <>
            <span>{jobDetails?.title}</span><br />
            <span>{jobDetails?.status}</span>
        </>
    )
}

export default JobCard
