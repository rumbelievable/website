import React from 'react';
import { Container, Typography, Box, Fab } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ScrollTop } from '../blogs/20240513';

const images = [
  "v1714331957/panoramas/_DSC5075-Pano_kqndj7.jpg",
  "v1714331954/panoramas/_DSC5196-Pano_p9cccf.jpg",
  "v1714331950/panoramas/_DSC0812-Pano_zbe5cr.jpg",
  "v1714331947/panoramas/_DSC9377-Pano_ep1fmh.jpg",
  "v1714331943/panoramas/DSC_2884-Pano_i5uz6a.jpg",
  "v1714331939/panoramas/_DSC8612-Pano-2_kgxlfq.jpg",
  "v1714331935/panoramas/_DSC2721-Pano_aypx4l.jpg",
  "v1714331932/panoramas/_DSC5290-Pano_pcfbot.jpg",
  "v1714331928/panoramas/_DSC5558-Pano_eb8ych.jpg",
  "v1714331924/panoramas/_DSC2626-Pano_mjaifn.jpg",
  "v1714331921/panoramas/_DSC9481-Pano_j6haon.jpg",
  "v1714331917/panoramas/_DSC9031-Pano_ivxlfw.jpg",
  "v1714331913/panoramas/_DSC1870-Pano_inrzm9.jpg",
  "v1714331910/panoramas/_DSC0840-Pano_zzxskk.jpg",
  "v1714331906/panoramas/_DSC0778-Pano_eewxbb.jpg",
  "v1714331903/panoramas/_DSC7557-Pano_copy_qyhlol.jpg"
]


function PanoramaGallery(props) {
  return (
    <React.Fragment>
    <Container maxWidth="100%">
      <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
        Panoramas
      </Typography>
      <Typography variant="h6" align="center">
        My there's-so-much-I-must-capture-it-all.
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Masonry columns={2} spacing={2}>
          {images.map((image, index) => (
            <div key={index}>
              <img
                src={`https://res.cloudinary.com/df4rizvgx/image/upload/f_auto/q_auto/${image}`}
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

export default PanoramaGallery;
