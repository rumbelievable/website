import React from 'react';
import logo from './rumbelievable.png';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, MenuItem, Box } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import ArticleIcon from '@mui/icons-material/Article';
import PersonIcon from '@mui/icons-material/Person';
import PanoramaIcon from '@mui/icons-material/Panorama';
import DiamondIcon from '@mui/icons-material/Diamond';
import ForestIcon from '@mui/icons-material/Forest';
import NightlightIcon from '@mui/icons-material/Nightlight';
import PetsIcon from '@mui/icons-material/Pets';
import LandscapeIcon from '@mui/icons-material/Landscape';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CameraIcon from '@mui/icons-material/Camera';


function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);

  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const goToHomePage = () => {
    navigate('/');
  };

  const Icon = ({ src, alt, width, height }) => {
    return <img src={src} alt={alt} width={width} height={height} />;
  };

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" enableColorOnDark>
        <Toolbar id='back-to-top-anchor'>
          <Box sx={{
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center',
            flexGrow: 1
          }}>
            <Box sx={{
              display: 'flex',
              backgroundColor: "#282c34",
              borderRadius: 2,
              width: 52,
              height: 52,
              cursor: "pointer",
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'background-color 0.3s', // Add smooth transition
              '&:hover': {
                backgroundColor: "#3e4451", // Change this to your desired hover color
              }
            }}
              onClick={goToHomePage}>
              <Icon src={logo} alt="Logo" width={40} height={40} />
            </Box>
          </Box>
          <Button color="inherit" component={Link} to="/" startIcon={<HomeIcon />}>
            Home
          </Button>
          <Button
            startIcon={<CameraIcon />}
            color="inherit"
            endIcon={<ExpandMoreIcon />}
            aria-owns={anchorEl ? "header" : undefined}
            aria-haspopup="true"
            component={Link}
            to="/photography"
            onMouseEnter={handleMouseEnter}
          >
            Photography
          </Button>
          <Menu
            id="header"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            MenuListProps={{ onMouseLeave: handleClose }}
          >
            <MenuItem component={Link} to="/albums/landscapes" onClick={handleClose}>
              <ForestIcon fontSize="small" style={{ marginRight: 8 }} /> Landscapes
            </MenuItem>
            <MenuItem component={Link} to="/albums/mountains" onClick={handleClose}>
              <LandscapeIcon fontSize="small" style={{ marginRight: 8 }} /> Mountains
            </MenuItem>
            <MenuItem component={Link} to="/albums/night-sky" onClick={handleClose}>
              <NightlightIcon fontSize="small" style={{ marginRight: 8 }} /> Night Sky
            </MenuItem>
            <MenuItem component={Link} to="/albums/panoramas" onClick={handleClose}>
              <PanoramaIcon fontSize="small" style={{ marginRight: 8 }} /> Panoramas
            </MenuItem>
            <MenuItem component={Link} to="/albums/reflections" onClick={handleClose}>
              <DiamondIcon fontSize="small" style={{ marginRight: 8 }} /> Reflections
            </MenuItem>
            <MenuItem component={Link} to="/albums/wildlife" onClick={handleClose}>
              <PetsIcon fontSize="small" style={{ marginRight: 8 }} /> Wildlife
            </MenuItem>
          </Menu>
          <Button color="inherit" component={Link} to="/blog" startIcon={<ArticleIcon />}>
            Blog
          </Button>
          <Button color="inherit" component={Link} to="/about-me" startIcon={<PersonIcon />}>
            About Me
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;