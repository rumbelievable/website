import React from 'react';
import { Container, Typography, Box, Fab } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ScrollTop } from '../blogs/20240513';

const images = [
  "v1714331400/reflections/_DSC2657_uzfwi5.jpg",
  "v1714331398/reflections/_DSC6723_t9mvac.jpg",
  "v1714331395/reflections/DSC_2637_umvorf.jpg",
  "v1714331393/reflections/DSC_4109_sfs2jb.jpg",
  "v1714331390/reflections/DSC_2106_w8ra78.jpg",
  "v1714331262/reflections/DSC_4044_ocxuyr.jpg",
  "v1714331260/reflections/_DSC1790_yidul7.jpg",
  "v1714331257/reflections/_DSC3545_ulridw.jpg",
  "v1714331255/reflections/_DSC9489_tqcozr.jpg",
  "v1714331252/reflections/_DSC9475_gbbeoj.jpg",
  "v1714331250/reflections/DSC_2177_x6aseu.jpg",
  "v1714331247/reflections/DSC_3113_vexgpu.jpg",
  "v1714331228/reflections/DSC_8965_tevbak.jpg",
  "v1714331245/reflections/DSC_2130_e2eai6.jpg",
  "v1714331242/reflections/DSC_3128_vnz98i.jpg",
  "v1714331240/reflections/DSC_4037_uuosqm.jpg",
  "v1714331237/reflections/DSC_2217_faublr.jpg",
  "v1714331235/reflections/DSC_0519_smkipq.jpg",
  "v1714331232/reflections/DSC_3083_stputl.jpg",
  "v1714331231/reflections/DSC_4130_l5sjfh.jpg"
]


function ReflectionGallery(props) {
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

export default ReflectionGallery;
