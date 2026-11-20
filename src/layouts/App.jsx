import React, { lazy, Suspense } from "react";
import Header from "./layoutcomponents/header";
import Sidebar from "./layoutcomponents/sidebar";
import Footer from "./layoutcomponents/footer";
import { Outlet } from "react-router-dom";
import Modal from "./modal/Modal";
import Loader from "./layoutcomponents/loader";

const RightSidebar = lazy(() =>
  import("./layoutcomponents/rightsidebar").then((m) => ({ default: m.RightSidebar }))
);

export default function App() {
  document.querySelector("body").classList.add("app", "sidebar-mini", "ltr", "light-mode");
  document.querySelector("body")?.classList.remove("login-img");

  return (
    <>
      <div className="horizontalMenucontainer">
        <div className="page">
          <div className="page-main">
            <Header />
            <Sidebar />
            <Modal />
            <div className="main-content app-content ">
              <div className="side-app">
                <div className="main-container container-fluid"
                  onClick={() => {
                    document.querySelector(".app")?.classList.remove("sidenav-toggled");
                    document.querySelector(".sidebar-right")?.classList.remove("sidebar-open");
                  }}>
                  <Suspense fallback={<Loader />}>
                    <Outlet />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
          <Suspense fallback={null}>
            <RightSidebar />
          </Suspense>
          <Footer />
        </div>
      </div>
    </>
  );
}
