import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AdminPage from './pages/AdminPage'
import AdminSystemPage from './pages/AdminSystemPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import UpdatePasswordPage from './pages/UpdatePasswordPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="professional">
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-system"
          element={
            <ProtectedRoute role="system_admin">
              <AdminSystemPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/update-password"
          element={<UpdatePasswordPage />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App