import React from 'react';
// import { Nav, Button, Container, Navbar, NavbarBrand, NavItem } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';


function NavMenu() {
  let navigate = useNavigate();
  const user = getCurrentUserFromCookies()
  let button = null;
  let adminNav = null;

  function handleLogout() {
    document.cookie = "user" + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    navigate('/login')
  }

  if (user) {
    button = <Button onClick={handleLogout}>logout</Button>
  } else {
    button = <Button href="/login">login</Button>
  }

  if (user.role === "admin") {
    adminNav = <Nav.Link href="/admin">Admin</Nav.Link>
  } else {
    adminNav = ""
  }


  return (
    <header>
      <Navbar bg="dark" variant="dark" className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
        <Container>
          <NavbarBrand className='navbar-brand' tag={Link} to="/">LearningTool</NavbarBrand>
          <ul className="navbar-nav flex-grow">
            <Container>
              <Nav className="me-auto">
                {adminNav}
                <Nav.Link href="/profile">Profile</Nav.Link>
              </Nav>
            </Container>
            <Container>
              {button}
            </Container>
          </ul>
        </Container>
      </Navbar>
    </header>
  );

}

export default NavMenu;