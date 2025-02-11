import React, { useState } from "react";
import "./nav.css";
import { Route, Link, Routes, BrowserRouter } from "react-router-dom";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Upload from "./components/upload";
import LawyerDashB from "./components/LawyerDashB";
import ClientDashB from "./components/ClientDashB";
// import JudgeDashBoard from "./components/JudgeDashB";
import Services from "./components/Services";
import Doc from "./components/Doc";
import Casedoc from "./components/Casedoc";
import Casenum from "./components/Casenum";
import Fir from "./components/FIR";
import Party from "./components/Partyname";

const Navigation = () => {
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);

  const handleServicesToggle = (isOpen) => {
    setShowServicesDropdown(isOpen);
  };

  return (
    <BrowserRouter>
      <Navbar bg="light" expand="lg">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="nav-link">
            <Nav.Link as={Link} to={"/"}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to={"/Register"}>
              Register
            </Nav.Link>
            <Nav.Link as={Link} to={"/Login"}>
              Login
            </Nav.Link>

            {/* Dropdown for Services */}
            <Dropdown
              className="nav-item"
              show={showServicesDropdown}
              onMouseEnter={() => handleServicesToggle(true)}
              onMouseLeave={() => handleServicesToggle(false)}
            >
              <Dropdown.Toggle className="dropdown-toggle">
                Services
              </Dropdown.Toggle>

              <Dropdown.Menu className="custom-dropdown">
                <Dropdown.Item
                  className="has-submenu"
                  as={Link}
                  to={"/Services"}
                >
                  Case Status
                  <Dropdown.Menu className="submenu">
                    <Dropdown.Item as={Link} to={"/Services"}>
                      Case Number
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to={"/"}>
                      Case Type
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to={"/Services"}>
                      FIR Number
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to={"/Services"}>
                      Case Code
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to={"/Services"}>
                      Party Name
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to={"/Services"}>
                      Advocate Name
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to={"/Services"}>
                      Act
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to={"/Services"}>
                      Form-28
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to={"/Services"}>
                      Case Document
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Item>

                <Dropdown.Item className="has-submenu">
                  Court Order
                  <Dropdown.Menu className="submenu">
                    <Dropdown.Item as={Link} to={"/"}>
                      Order Number
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to={"/"}>
                      Order Date
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Item>

                <Dropdown.Item as={Link} to={"/"}>
                  Cause List
                </Dropdown.Item>
                <Dropdown.Item as={Link} to={"/"}>
                  Judgments
                </Dropdown.Item>
                <Dropdown.Item as={Link} to={"/"}>
                  Office Reports
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Nav.Link href="#eservices">e-Services</Nav.Link>
            <Nav.Link href="#filings">Court Filings</Nav.Link>
            <Nav.Link href="#about">About Us</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Define the Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Upload" element={<Upload />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Services" element={<Services />} />
        {/* <Route path="/LawyerDashB" element={<LawyerDashB />} /> */}
        <Route path="/ClientDashB" element={<ClientDashB />} />
        <Route path="/Doc" element={<Doc />} />
        <Route path="/Casedoc" element={<Casedoc />} />
        <Route path="/Casenum" element={<Casenum />} />
        <Route path="/Fir" element={<Fir />} />
        <Route path="/Party" element={<Party />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Navigation;
