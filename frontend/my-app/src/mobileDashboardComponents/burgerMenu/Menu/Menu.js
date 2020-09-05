import React from 'react';
import { bool } from 'prop-types';
import { StyledMenu } from './Menu.styled';
const Menu = ({ open, browseClicked, chatClicked, propertiesClicked, aboutClicked }) => {
  return (
    <StyledMenu open={open}>
      <button onClick={browseClicked}>
        Browse
      </button>
      <button onClick={chatClicked}>
        Chat
      </button>
      <button onClick={propertiesClicked}>
        Properties
      </button>
      <button onClick={aboutClicked}>
        About
      </button>
    </StyledMenu>
  )
}
Menu.propTypes = {
  open: bool.isRequired,
}
export default Menu;