import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import M from "materialize-css";
import logoHeaderLight from "../../assets/image/logo-header-light.png";
import logoHeaderDark from "../../assets/image/logo-header-dark.png";

import { Context } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext";

import css from "../../styles/components/Layout/Header.module.css";

export default function Header() {
  const { handleLogout } = useContext(Context);
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    M.Sidenav.init(document.querySelectorAll(".sidenav"));

    M.Dropdown.init(document.querySelectorAll(".dropdown-trigger"), {
      coverTrigger: false,
    });
  });

  const handleLogoutHeader = () => {
    handleLogout();
  };
  const handleToggleTheme = () => {
    toggleTheme();
  };

  return (
    <>
      <nav className={`${css.header} ${theme === "dark" && css.dark}`}>
        <div className="container">
          <div className="nav-wrapper">
            <Link to="/Home" className={`brand-logo ${css.logo_header}`}>
              <img
                src={theme !== "dark" ? logoHeaderLight : logoHeaderDark}
                alt="logo"
              />
            </Link>
            <a href="#" data-target="mobile-demo" className="sidenav-trigger">
              <i className="material-icons">menu</i>
            </a>
            <li>
              <a onClick={handleToggleTheme}>
                <i className="material-icons right">
                  {theme === "light" ? "brightness_2" : "brightness_5"}
                </i>
              </a>
            </li>

            <ul className="right hide-on-med-and-down">
              <li>
                <Link className="waves-effect waves-light btn" to="/Home">
                  Home
                </Link>
              </li>
              <li>
                <Link className="waves-effect waves-light btn" to="/Charts">
                  Charts
                </Link>
              </li>
              <li>
                <i
                  data-target="dropdownNavBar"
                  className="dropdown-trigger circle material-icons right"
                >
                  account_circle
                </i>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <ul className="sidenav" id="mobile-demo">
        <li>
          <Link className="waves-effect waves-light " to="/Home">
            Home
          </Link>
        </li>
        <li>
          <Link className="waves-effect waves-light " to="/Charts">
            Charts
          </Link>
        </li>
        <li>
          <a className="dropdown-trigger" data-target="dropdownSideBar">
            Usuario
            <i className="material-icons right">arrow_drop_down</i>
          </a>
        </li>
      </ul>
      <ul id="dropdownSideBar" className="dropdown-content">
        <li>
          <Link to="/Perfil">Perfil</Link>
        </li>
        <li className="divider"></li>
        <li>
          <a onClick={handleLogoutHeader}>Logout</a>
        </li>
      </ul>
      <ul id="dropdownNavBar" className="dropdown-content nested">
        <li>
          <Link to="/Perfil">Perfil</Link>
        </li>
        <li className="divider"></li>
        <li>
          <a onClick={handleLogoutHeader}>Logout</a>
        </li>
      </ul>
    </>
  );
}
