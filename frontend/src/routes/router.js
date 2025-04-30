import {ceateBrowserRouter} from "react-router";
import GuestLayout from "../layout/GuestLayout";
import AuthLayout from "../layout/AuthLayout";


const router = ceateBrowserRouter([
    {
        Component: GuestLayout,
    },
    {
        Component: AuthLayout,
    }

]);


export default router;