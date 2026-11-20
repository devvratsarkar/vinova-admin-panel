import  {Fragment } from 'react';
import {Outlet} from 'react-router-dom'

export default function Custompages()  {
  document.querySelector("body").classList.remove("app", "sidebar-mini", "ltr", "light-mode");
 document.querySelector("body").classList.add("login-img");
  return (
    <Fragment>
    <div className="page login-page"> 
      <Outlet />
      </div>
    </Fragment>
  );
}
