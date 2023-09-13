"use client";
"use strict";
exports.__esModule = true;
var navigation_1 = require("next/navigation");
var Navbar_module_scss_1 = require("./Navbar.module.scss");
var link_1 = require("next/link");
var Navbar = function (props) {
    var pathname = navigation_1.usePathname();
    var isAuthenticated = props.isAuthenticated, isAdmin = props.isAdmin;
    var links = [
        {
            title: "Home",
            url: "/",
            showOnPages: [
                "/dashboard",
                "/dashboard/profile",
                "/dashboard/settings",
                "/dashboard/admin",
            ]
        },
        {
            title: "Profile",
            url: "/dashboard/profile",
            showOnPages: ["/dashboard"]
        },
    ];
    if (isAuthenticated) {
        links.push({
            title: "Logout",
            url: "/dashboard/logout",
            showOnPages: [
                "/dashboard",
                "/dashboard/profile",
                "/dashboard/settings",
                "/dashboard/admin",
            ]
        });
    }
    else {
        links.push({
            title: "Admin Login",
            url: "/dashboard/login",
            showOnPages: ["/"]
        });
    }
    if (isAdmin) {
        links.push({
            title: "Dashboard",
            url: "/dashboard",
            showOnPages: ["/dashboard/profile", "/dashboard/settings"]
        }, {
            title: "Admin Settings",
            url: "/dashboard/settings",
            showOnPages: [
                "/dashboard/admin",
                "/dashboard/profile",
                "/dashboard",
                "/dashboard/settings",
            ]
        });
    }
    return (React.createElement("nav", { className: Navbar_module_scss_1["default"].nav },
        React.createElement("div", { className: Navbar_module_scss_1["default"].nav__title }, "PARKING MONITOR"),
        React.createElement("ul", { className: Navbar_module_scss_1["default"].nav__list }, links.map(function (link, index) {
            // Check if the link should be displayed on the current page
            if (link.showOnPages.includes(pathname)) {
                return (React.createElement(link_1["default"], { key: index, href: link.url, className: Navbar_module_scss_1["default"].nav__list__link },
                    React.createElement("li", null, link.title)));
            }
            return null; // Render nothing if link should not be displayed
        }))));
};
exports["default"] = Navbar;
