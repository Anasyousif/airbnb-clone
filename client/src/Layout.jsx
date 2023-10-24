import { Outlet } from "react-router-dom";
import Header from "./Header";

export function Layout() {
    return(
        <div className="p-4 felx felx-col min-h-screen">
          <Header />
          <Outlet /> 
        </div>
    );
}