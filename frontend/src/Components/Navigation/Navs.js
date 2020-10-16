import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import "./Navs.css";

import PersonPin from "@material-ui/icons/PersonPin";
import { AppBar, Tab, Tabs, Toolbar } from "@material-ui/core";

const Nav = (props) => {
  let NavLinks = [
    "Shop",
    "Products",
    "Cart",
    "Order",
    "Admin Products",
    "Add Products",
  ];
  let AuthLinks = ["Login", "Register"];
  const [value] = useState(false);
  const [loginValue] = useState(false);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <nav className="main-header__nav">
            <ul className="main-header__item-list">
              <Tabs value={value}>
                {NavLinks.map((item, i) => (
                  <NavLink
                    key={i}
                    to={`/${item.toLowerCase().split(" ").join("")}`}
                  >
                    <Tab
                      label={`${item}`}
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "white",
                        textDecoration: "none",
                      }}
                    />
                  </NavLink>
                ))}
              </Tabs>
            </ul>

            <ul className="main-header__item-list">
              <Tabs value={loginValue}>
                {!props.isAuth ? (
                  AuthLinks.map((item, i) => (
                    <NavLink key={i} to={`/${item.toLowerCase()}`}>
                      <Tab
                        icon={<PersonPin fontSize="small" />}
                        label={`${item}`}
                        style={{
                          background: "transparent",
                          color: "white",
                        }}
                      />
                    </NavLink>
                  ))
                ) : (
                  <NavLink to={`/login`}>
                    <Tab
                      icon={<PersonPin fontSize="small" />}
                      onClick={props.logoutClicked}
                      label={`Logout`}
                      style={{
                        background: "transparent",
                        color: "white",
                      }}
                    />
                  </NavLink>
                )}
              </Tabs>
            </ul>
          </nav>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Nav;
