import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './pages/Authentication/Login';
import LandingPage from './pages/LandingPage/LandingPage';
import LayoutWithNav from './pages/Layout/LayoutWithNav';
import LayoutWithoutNav from './pages/Layout/LayoutWithoutNav';


function App() {
  const router = createBrowserRouter([
    {
      element: <LayoutWithNav />,
      children: [
        {
          path: "/",
          element: <LandingPage />
        }
      ]
    },
    {
      element: <LayoutWithoutNav />,
      children: [
        {
          path: "/user/login",
          element: <Login />
        }
      ]
    }
  
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
