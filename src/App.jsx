import { React, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import './App.css';
import { lightTheme, darkTheme } from './theme';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Photography from './pages/Photography';
import Landscape from './pages/albums/Landscapes';
import Mountain from './pages/albums/Mountains';
import NightSky from './pages/albums/NightSky';
import Panorama from './pages/albums/Panoramas';
import Reflection from './pages/albums/Reflections';
import Wildlife from './pages/albums/Wildlife';
import Blog from './pages/Blog';
import AboutMe from './pages/AboutMe';
import Blog1 from './pages/blogs/20240513'
import Blog2 from './pages/blogs/20240517'
import Blog3 from './pages/blogs/20240524'
import Blog4 from './pages/blogs/20240601'
import Blog5 from './pages/blogs/20241102'


// const theme = createTheme({
//   palette: {
//     mode: 'dark',
//     primary: {
//       main: '#4da98c',
//     },
//     secondary: {
//       main: '#a94d6a',
//     },
//     info: {
//       main: '#8c4da9'
//     },
//     success: {
//       main: '#4da98c',
//     },
//   },
//   typography: {
//     fontFamily: [
//       '-apple-system',
//       'BlinkMacSystemFont',
//       '"Segoe UI"',
//       'Roboto',
//       '"Helvetica Neue"',
//       'Arial',
//       'sans-serif',
//       '"Apple Color Emoji"',
//       '"Segoe UI Emoji"',
//       '"Segoe UI Symbol"',
//     ].join(',')
//   },
// });

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    // <ThemeProvider theme={theme}>
    <ThemeProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <ThemeToggle />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/photography" element={<Photography />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/about-me" element={<AboutMe />} />
              <Route path="/albums/landscapes" element={<Landscape />} />
              <Route path="/albums/mountains" element={<Mountain />} />
              <Route path="/albums/night-sky" element={<NightSky />} />
              <Route path="/albums/panoramas" element={<Panorama />} />
              <Route path="/albums/reflections" element={<Reflection />} />
              <Route path="/albums/wildlife" element={<Wildlife />} />
              <Route path="/blog/20240513" element={<Blog1 />} />
              <Route path="/blog/20240517" element={<Blog2 />} />
              <Route path="/blog/20240524" element={<Blog3 />} />
              <Route path="/blog/20240601" element={<Blog4 />} />
              <Route path="/blog/20241102" element={<Blog5 />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
