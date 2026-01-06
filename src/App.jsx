import Home from './Home/Home'
import Video from './Home/Video'
import VideoComments from './Home/VideoComments'
import Notifications from './Router/NotifyUser'
import Notify from './notifications/notification'
import Login from './components/Login'
import Register from './components/Register'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Profile from './Profile/ProfilePage'
import CreateBlog from './CreatePost/CreateBlogPage'
import CreateVideo from './CreatePost/CreateVideo'
import Faq from './Faqpage/FaqPage'
import UserProfilePage from './Display/DispalyProfile'
import Comment from './Router/Comment and Like'
import EditProfile from './EditProfile/EditProfile2'
import Contact from './Router/Contact-Form'
import ResetPassword from './Updates/ResetPassword'
import Callback from './Router/Callback'
import ProfilePage from './Display/DispalyProfile'
import OnlinePresence from './Updates/OnlinePresence'
import Updatepost from './Profile/Updatepost'
import Photo from './Updates/Photo'
import ShowPhoto from './Updates/ShowPhoto'
import Searchusers from './Updates/Searchusers'
import Setupprofile from './components/Setupprofile'
import ForgotPassword from './Updates/ForgotPassword'
import Invite from './Updates/Invite'


const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="Forgot" element={<ForgotPassword />} />
            <Route path="register" element={<Register />} />
            <Route path="register" element={<Register />} />
            <Route path="Setup" element={<Setupprofile />} />
            <Route path="Faq" element={<Faq />} />
            <Route path="Invite" element={<Invite />} />
            <Route path="createBlog" element={<CreateBlog />} />
            <Route path="createVideo" element={<CreateVideo />} />
            <Route path="profile" element={<Profile />} />
            <Route path="Online-Users" element={<OnlinePresence />} />
            <Route path="Searchusers" element={<Searchusers />} />
            <Route path="Videos" element={<Video />} />
            <Route path="/auth/callback" element={<Callback />} />
            <Route path="/profile/:userId" element={<UserProfilePage />} />
            <Route path="/post/:postId/comments" element={<Comment/>} />
            <Route path="/post/:postId/Videos" element={<VideoComments/>} />
            <Route path="/post/:postId/UpdatePost" element={<Updatepost/>} />
            <Route path="Edit" element={<EditProfile />} />
            <Route path="Contact" element={<Contact />} />
            <Route path="Photo" element={<Photo />} />
            <Route path="/ShowPhoto/:userId" element={<ShowPhoto />} />
            <Route path="Notify" element={<Notifications />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Notify />
    </div>
  )
}

export default App