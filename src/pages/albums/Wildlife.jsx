import React from 'react';
import { Container, Typography, Box, Fab } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ScrollTop } from '../blogs/20240513';

const images = [
  "v1714331554/wildlife/DSC_5146_uvg4ah.jpg",
  "v1714331512/wildlife/_DSC1662_xfztm5.jpg",
  "v1714331508/wildlife/_DSC6841-2_copy_uqtqxe.jpg",
  "v1714331505/wildlife/DSC_5111_wdjkf2.jpg",
  "v1714331501/wildlife/DSC_4938_ukfuyp.jpg",
  "v1714331495/wildlife/_DSC5545_xznte3.jpg",
  "v1714331490/wildlife/_DSC1272_ravkyp.jpg",
  "v1714331484/wildlife/_DSC3054_ko73il.jpg",
  "v1714331478/wildlife/_DSC5551_n5jkyc.jpg",
  "v1714331472/wildlife/_DSC0780_gq3ogq.jpg",
  "v1714331501/wildlife/_DSC1829_yqf43x.jpg",
  "v1714331496/wildlife/_DSC2252_t7epki.jpg",
  "v1714331490/wildlife/_DSC5382_jkdtjm.jpg",
  "v1714331482/wildlife/_DSC7667_zfkq5a.jpg",
  "v1714331475/wildlife/_DSC0625_lqkdil.jpg",
  "v1714331469/wildlife/_DSC3020_jaxmqm.jpg",
  "v1714331455/wildlife/_DSC7707_a3i4kd.jpg",
  "v1714331452/wildlife/DSC_3969_copy_fvipfq.jpg",
  "v1714331463/wildlife/_DSC3052_ipklkq.jpg",
  "v1714331441/wildlife/_DSC0870_zgvcm5.jpg",
  "v1714331466/wildlife/_DSC1871_renuyu.jpg",
  "v1714331460/wildlife/_DSC0768_ooqgkn.jpg",
  "v1714331458/wildlife/_DSC3019_cqhmye.jpg",
  "v1714331449/wildlife/DSC_4966_ph9ble.jpg",
  "v1714331446/wildlife/_DSC7784_kpjkt2.jpg",
  "v1714331444/wildlife/_DSC1826_rbcmtc.jpg",
  "v1714331438/wildlife/_DSC3023_im2aog.jpg",
  "v1714331435/wildlife/_DSC5337_fowevl.jpg",
  "v1714331433/wildlife/_DSC2077_tddlbt.jpg",
  "v1714331430/wildlife/_DSC2292_fsccdl.jpg"
]


function WildlifeGallery(props) {
  return (
    <React.Fragment>
    <Container maxWidth="100%">
      <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
        Wildlife
      </Typography>
      <Typography variant="h6" align="center">
        My preferred living things.
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

export default WildlifeGallery;
