import { type JSX } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import Profile from "./components/Profile/Profile";
import Chat from "./components/Chat/Chat";
import TodoList from "./components/Todo/TodoList";
import FileUpload from "./components/Files/FileUpload";
import FileList from "./components/Files/FileList";
import EventsPage from "./components/Events/EventsPage";
import ProductCatalog from "./components/Products/ProductCatalog";
import Favorites from "./components/Products/Favorites";
import FeedbackForm from "./components/Feedback/FeedbackForm";
import FeedbackList from "./components/Feedback/FeedbackList";
import PostForm from "./components/Blog/PostForm";
import BlogList from "./components/Blog/BlogList";
import NotificationFeed from "./components/Notifications/NotificationFeed";
import NotificationPostForm from "./components/Notifications/NotificationPostForm";
import NotificationEdit from "./components/Notifications/NotificationEdit";

// import NotificationForm from "./components/Notifications/NotificationForm"; // ✅ add this

function Private({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/notifications/edit/:id" element={<Private><NotificationEdit /></Private>} />
          <Route path="/notifications" element={<Private><><NotificationPostForm />  {/* Admin-only form */}<NotificationFeed />      {/* Visible to everyone */}</></Private>} />
          <Route path="/profile" element={<Private><Profile /></Private>} />
          <Route path="/chat" element={<Private><Chat /></Private>} />
          <Route path="/todo" element={<Private><TodoList /></Private>} />
          <Route path="/files" element={<Private><FileUpload /></Private>} />
          <Route path="/file-list" element={<Private><FileList /></Private>} />
          <Route path="/events" element={<Private><EventsPage /></Private>} />
          <Route path="/products" element={<Private><ProductCatalog /></Private>} />
          <Route path="/favorites" element={<Private><Favorites /></Private>} />
          <Route path="/feedback" element={<Private><><FeedbackForm /><FeedbackList /></></Private>} />
          <Route path="/blog" element={<Private><><PostForm /><BlogList /></></Private>} />

          {/* ✅ Notifications Route */}
          <Route
            path="/notifications"
            element={
              <Private>
                <>
                  <NotificationFeed />
                </>
              </Private>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
