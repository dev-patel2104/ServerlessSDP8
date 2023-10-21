import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './pages/UserManagement/Login';
import LandingPage from './pages/LandingPage/LandingPage';
import LayoutWithNav from './pages/Layout/LayoutWithNav';
import LayoutWithoutNav from './pages/Layout/LayoutWithoutNav';
import Profile from './pages/UserManagement/Profile';
import Signup from './pages/UserManagement/Signup';
import BookTable from './pages/BookTable/BookTable';

function App() {
  const router = createBrowserRouter([
    {
      element: <LayoutWithNav />,
      children: [
        {
          path: "/",
          element: <LandingPage />
        },
        {
          path: "/restaurant/:restaurantID/book",
          element: <BookTable />
        },
        {
          path: "/user/profile",
          element: <Profile />
        }
      ]
    },
    {
      element: <LayoutWithoutNav />,
      children: [
        {
          path: "/user/login",
          element: <Login />
        },
        {
          path: "/user/signup",
          element: <Signup />
        }
      ]
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
