import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import getCurrentUser from "../../utils/getCurrentUser";
import "./Navbar.scss";

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const currentUser = getCurrentUser();

  const isActive = () => {
    setActive(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => window.removeEventListener("scroll", isActive);
  }, []);

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.removeItem("currentUser");
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link className="link" to="/">
            <span className="text">gigex</span>
          </Link>
          <span className="dot">.</span>
        </div>

        <div className="hamburger" onClick={() => setShow(!show)}>
          <img src="/img/hamburger.png" alt="Menu" />
        </div>

        <div className={`links ${show ? "show" : ""}`}>
          <span>Gigex Business</span>
          <span>Explore</span>
          <span>English</span>
          {!currentUser?.isSeller && <span>Become a Seller</span>}

          {currentUser ? (
            <div className="user" onClick={() => setOpen(!open)}>
              <img src={currentUser.img || "/img/user.jpg"} alt="user" />
              <span>{currentUser.username}</span>
              {open && (
                <div className="options">
                  {currentUser.isSeller && (
                    <>
                      <Link className="link" to="/mygigs">Gigs</Link>
                      <Link className="link" to="/add">Add New Gig</Link>
                    </>
                  )}
                  <Link className="link" to="/orders">Orders</Link>
                  <Link className="link" to="/messages">Messages</Link>
                  <Link className="link" onClick={handleLogout}>Logout</Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link className="link" to="/login">Sign in</Link>
              <Link className="link" to="/register"><button>Join</button></Link>
            </>
          )}
        </div>
      </div>

      {(active || pathname !== "/") && (
        <>
          <hr />
          <div className="menu">
            <Link className="link menuLink" to="/">Graphics & Design</Link>
            <Link className="link menuLink" to="/">Video & Animation</Link>
            <Link className="link menuLink" to="/">Writing & Translation</Link>
            <Link className="link menuLink" to="/">AI Services</Link>
            <Link className="link menuLink" to="/">Digital Marketing</Link>
            <Link className="link menuLink" to="/">Music & Audio</Link>
            <Link className="link menuLink" to="/">Programming & Tech</Link>
            <Link className="link menuLink" to="/">Business</Link>
            <Link className="link menuLink" to="/">Lifestyle</Link>
          </div>
          <hr />
        </>
      )}
    </div>
  );
}

export default Navbar;
