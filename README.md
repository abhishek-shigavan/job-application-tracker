# Job Application Tracker

Job Application Tracker is a web application that allows users to manage and track their job applications efficiently. Users can log in using their Google account, add new jobs, update job statuses through drag-and-drop between columns, and edit job details when needed. Jobs are displayed in columns based on their current status.

## Features

- **Google Authentication**
  - Users can securely log in using their Google account.
  - Firebase Authentication is used for handling sign-in and sign-out functionality.

- **Protected Routes**
  - Only authenticated users can access the dashboard and job-related pages.
  - If an unauthenticated user tries to access a protected route, they are redirected to the login page.

- **Add New Job**
  - Users can add job applications with relevant details through a modal form.
  - Newly added jobs are immediately displayed under the selected status column.

- **Drag-and-Drop for Status Management**
  - Job cards can be dragged and dropped between different status columns (e.g., Applied, Interview, Offer, Hired, Rejected).
  - This updates the job’s status in real-time in Firestore.

- **Update Job Details**
  - Users can update job information by clicking on a job card and modifying the details.
  - All updates are persisted to Firestore.

- **Real-Time Job Display**
  - Jobs are fetched from Firestore using the `jobs` collection, filtered by the currently authenticated user.
  - Jobs are categorized and displayed in different columns based on their status.
  - The UI updates in real-time as data changes in Firestore.

## Technologies Used

### Libraries & Tools
- **Authentication**: Firebase Auth (Google Sign-In)
- **Database**: Firestore (Cloud Firestore)
- **UI Library**: Material UI
- **Drag & Drop**: DnD Kit

### Styling
- **SCSS**

## Functionalities

- User login using Google account
- Add a new job via modal
- View jobs in columns based on their status
- Drag and drop jobs between status columns to update their state
- Update job details via a detailed view
- Real-time syncing of jobs with Firestore

## Deployment

### Hosting on Vercel

The project can be easily deployed on [Vercel](https://vercel.com/). Follow the steps below:

1. **Push to GitHub**
   - Ensure your project code is committed and pushed to a GitHub repository.

2. **Setup on Vercel**
   - Go to [vercel.com](https://vercel.com/) and sign in with your GitHub account.
   - Click on **"Add New Project"** and import your repository.
   - Configure the build settings if needed:
     - **Framework Preset**: React
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist` or `build` (depending on your setup)

3. **Environment Variables**
   - In the project dashboard on Vercel, go to **Settings > Environment Variables**.
   - Add your Firebase configuration values (e.g., `VITE_API_KEY`, `VITE_AUTH_DOMAIN`, etc.) as environment variables.
   - Ensure these are prefixed with `VITE_` if you're using Vite.

4. **Trigger a Build**
   - After setting the environment variables, Vercel will automatically deploy your site.
   - You can also trigger a manual redeploy from the Vercel dashboard.

5. **Live Preview**
   - Once deployed, Vercel will provide a live URL for your project.
   - You can also set up a custom domain if needed.