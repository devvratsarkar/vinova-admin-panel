import React from "react";
import loaderSvg from "../../assets/images/loader.svg";

const Loader = () => {
  return (
    <div id="global-loader">
      <img
        src={loaderSvg}
        className="loader-img"
        alt="Loading...."
      />
    </div>
  );
};

export default Loader;
