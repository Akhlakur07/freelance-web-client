import { createBrowserRouter } from "react-router";
import Root from "../pages/Root";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import AddTask from "../pages/AddTask";
import BrowseTask from "../pages/BrowseTask";
import PrivateRoute from "../components/PrivateRoute";
import MyTasks from "../pages/MyTasks";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/profile",
        Component: Profile,
      },
      {
        path: "/add-task",
        element: (
          <PrivateRoute>
            <AddTask></AddTask>
          </PrivateRoute>
        ),
      },
      {
        path: "/browse-task",
        element: (
          <PrivateRoute>
            <BrowseTask></BrowseTask>
          </PrivateRoute>
        ),
      },
      {
        path: "/my-tasks",
        element:(
          <PrivateRoute>
            <MyTasks></MyTasks>
          </PrivateRoute>
        )
      }
    ],
  },
]);

export default router;
