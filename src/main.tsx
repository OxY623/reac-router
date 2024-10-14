
import { createRoot } from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";
import './index.css'
import { StrictMode } from "react";
import ErrorPage from "./error-page.tsx";
import Contact from "./routes/contact.tsx";
import Root, { loader as rootLoader } from "./routes/root";

const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <Root />,
            errorElement:<ErrorPage/>,
            loader: rootLoader,
            children: [
                {
                    path: "contacts/:contactId",
                    element: <Contact />,
                },
            ],
        },
        // {
        //     path: 'contacts/:contactId',
        //     element: <Contact/>
        // }
    ]
);




createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
