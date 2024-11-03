import React from 'react';
import { Container, Typography, Box, Fab } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ScrollTop } from '../blogs/20240513';

const images = [
  "v1714331188/night-sky/_DSC5012_msubzd.jpg",
  "v1714331195/night-sky/DSC_2709_vc3g8l.jpg",
  "v1714330908/night-sky/DSC_9412_wsi6yr.jpg",
  "v1714330912/night-sky/DSC_2408-2_l2fgh4.jpg",
  "v1714331186/night-sky/_DSC4998_k2j3or.jpg",
  "v1714331193/night-sky/_DSC5015_ajtnto.jpg",
  "v1714331191/night-sky/DSC_2718_nv4lik.jpg",
  "v1714331184/night-sky/_DSC5007_b3oddf.jpg",
  "v1714331181/night-sky/_DSC5413_mvnlxs.jpg",
  "v1714331179/night-sky/_DSC5006-2_jlflzc.jpg",
  "v1714331177/night-sky/_DSC4997_sesdjp.jpg",
  "v1714330916/night-sky/DSC_2406-2_oehlvy.jpg",
  "v1714330914/night-sky/DSC_5920_bm4lyj.jpg",
  "v1714330910/night-sky/_DSC4076_yko9yi.jpg",
  "v1714330906/night-sky/DSC_0367_wbpwz4.jpg",
  "v1714331175/night-sky/_DSC5442_xk9t3h.jpg"
]


function NightSkyGallery(props) {
  return (
    <React.Fragment>
    <Container maxWidth="100%">
      <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
        Night Sky
      </Typography>
      <Typography variant="h6" align="center">
        My existential crises.
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Masonry columns={4} spacing={2}>
          {images.map((image, index) => (
            <div key={index}>
              <img
                src={`https://res.cloudinary.com/df4rizvgx/image/upload/c_scale,w_650/f_auto/q_auto/${image}`}
                alt={`${index + 1}`}
                loading="lazy"
                style={{
                  borderRadius: 4,
                  display: 'block',
                  width: '100%',
                }}
              />
            </div>
          ))}
        </Masonry>
      </Box>
    </Container>
    <ScrollTop {...props}>
    <Fab size="small" aria-label="scroll back to top">
      <KeyboardArrowUpIcon />
    </Fab>
  </ScrollTop>
    </React.Fragment>
  );
}

export default NightSkyGallery;
