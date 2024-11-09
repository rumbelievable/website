import React, { useState } from 'react';
import { Container, Typography, Box, Fab, Modal } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ScrollTop } from '../blogs/20240513';

const images = [
  "v1714330865/mountains/DSC_8712_idczvd.jpg",
  "v1714330863/mountains/DSC_4254_pj0xjv.jpg",
  "v1714330861/mountains/DSC_6107_uyucta.jpg",
  "v1714330857/mountains/_DSC6462-Pano_copy_mzutnd.jpg",
  "v1714330855/mountains/DSC_2929_bu0kun.jpg",
  "v1714330854/mountains/DSC_0404_rbzqxj.jpg",
  "v1714330852/mountains/_DSC3754_ewxh0i.jpg",
  "v1714330848/mountains/_DSC2248_xxceif.jpg",
  "v1714330846/mountains/DSC_9837_lytmoo.jpg",
  "v1714330842/mountains/DSC_8757_e4oktc.jpg",
  "v1714330859/mountains/DSC_4232_wygp0y.jpg",
  "v1714330850/mountains/_DSC1227_jxc8lf.jpg",
  "v1714330844/mountains/DSC_9701_z49hvd.jpg",
  "v1714330831/mountains/_DSC3151_qni8tm.jpg",
  "v1714330462/mountains/_DSC2743_d8mtzl.jpg",
  "v1714330840/mountains/DSC_9671_n3i46y.jpg",
  "v1714330838/mountains/DSC_3809_ihhhdp.jpg",
  "v1714330836/mountains/DSC_3062_cfnsqk.jpg",
  "v1714330835/mountains/_DSC6383_tobnjw.jpg",
  "v1714330833/mountains/_DSC4776_fv3spz.jpg",
  "v1714330461/mountains/_DSC9509_iyndyv.jpg",
  "v1714330459/mountains/_DSC9461_ohtcb1.jpg",
  "v1714330457/mountains/_DSC8621_artaqa.jpg",
  "v1714330455/mountains/_DSC4941_ssulgd.jpg",
  "v1714330453/mountains/_DSC9477_bx12lz.jpg",
  "v1714330451/mountains/_DSC1130_utahza.jpg",
  "v1714330449/mountains/_DSC2713_wctjv0.jpg",
  "v1714330447/mountains/_DSC3703_qkmgzw.jpg",
  "v1714330437/mountains/_DSC2647_xs8oak.jpg",
  "v1714330431/mountains/DSC_3180_cbquni.jpg",
  "v1714330445/mountains/_DSC4812_ywlc5r.jpg",
  "v1714330443/mountains/_DSC9444_mrhfry.jpg",
  "v1714330441/mountains/_DSC2928_ifchqx.jpg",
  "v1714330440/mountains/DSC_6007_g8ie21.jpg",
  "v1714330435/mountains/DSC_2953_lykuks.jpg",
  "v1714330433/mountains/DSC_3034_dzdqwz.jpg",
  "v1714330430/mountains/_DSC2258_shu3cz.jpg",
  "v1714330428/mountains/_DSC3036_tmicvo.jpg",
  "v1714330426/mountains/DSC_8304_qgagil.jpg",
  "v1714330424/mountains/_DSC7471_nsxii0.jpg",
  "v1714330415/mountains/DSC_2115_hma4yd.jpg",
  "v1714330413/mountains/DSC_4096_px5vle.jpg",
  "v1714330411/mountains/DSC_9078_gppukk.jpg",
  "v1714330410/mountains/_DSC2870_i9jbye.jpg",
  "v1714330406/mountains/_DSC3516_weuqe5.jpg",
  "v1714330422/mountains/DSC_5610_a3puin.jpg",
  "v1714330421/mountains/_DSC9136_aml4oc.jpg",
  "v1714330419/mountains/_DSC7575_ncl2lq.jpg",
  "v1714330417/mountains/_DSC3832_mg5zo5.jpg",
  "v1714330408/mountains/_DSC0938_npwwec.jpg",
  "v1714330404/mountains/_DSC0785_ouuz0f.jpg",
  "v1714330403/mountains/_DSC0347_viuga0.jpg",
  "v1714330399/mountains/DSC_0458_i6uhsr.jpg",
  "v1714330401/mountains/_DSC0303_mj8mxm.jpg"
]

function MountainGallery(props) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <React.Fragment>
    <Container maxWidth="100%">
      <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
        Mountains
      </Typography>
      <Typography variant="h6" align="center">
        My cathedrals.
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Masonry columns={4} spacing={2}>
          {images.map((image, index) => (
            <div key={index} onClick={() => handleImageClick(image)}>
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
    <Modal
        open={selectedImage !== null}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darkened background
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={handleCloseModal}>

          {selectedImage && (
            <img
              src={`https://res.cloudinary.com/df4rizvgx/image/upload/${selectedImage}`}
              alt="Enlarged"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          )}
        </Box>
      </Modal>
    <ScrollTop {...props}>
    <Fab size="small" aria-label="scroll back to top">
      <KeyboardArrowUpIcon />
    </Fab>
  </ScrollTop>
    </React.Fragment>
  );
}

export default MountainGallery;
