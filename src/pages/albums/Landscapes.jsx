import React, { useState } from 'react';
import { Container, Typography, Box, Fab, Modal } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ScrollTop } from '../blogs/20240513';

const images = [
  "v1714329506/landscapes/_DSC0377_qjuueq.jpg",
  "v1714329526/landscapes/_DSC0610_tkqo5a.jpg",
  "v1714329525/landscapes/_DSC0672_iknvdy.jpg",
  "v1714329513/landscapes/_DSC0791_sx8kqv.jpg",
  "v1714329509/landscapes/_DSC0473_yjawfu.jpg",
  "v1714330291/landscapes/_DSC1263_shygdd.jpg",
  "v1714330310/landscapes/_DSC1914_e4aclr.jpg",
  "v1714329536/landscapes/_DSC2637_hlk3tf.jpg",
  "v1714329510/landscapes/_DSC4121_kp9dca.jpg",
  "v1714329534/landscapes/_DSC1840_himvw2.jpg",
  "v1714330309/landscapes/_DSC1255_jb7m0m.jpg",
  "v1714329531/landscapes/_DSC1924_bsxoac.jpg",
  "v1714330289/landscapes/_DSC2052_cb4oqt.jpg",
  "v1714330312/landscapes/_DSC2450_vkstis.jpg",
  "v1714329533/landscapes/_DSC4817_lz9fli.jpg",
  "v1714329514/landscapes/_DSC5487_jkqalm.jpg",
  "v1714329505/landscapes/_DSC5922_fzexg7.jpg",
  "v1714329516/landscapes/_DSC6042_z3fday.jpg",
  "v1714329530/landscapes/_DSC4773_n1smsu.jpg",
  "v1714329537/landscapes/_DSC1372_zqxznf.jpg",
  "v1714330285/landscapes/_DSC4879_kheb6h.jpg",
  "v1714330299/landscapes/_DSC4943_x9s4z9.jpg",
  "v1714330283/landscapes/_DSC5018_nbzdsb.jpg",
  "v1714329508/landscapes/_DSC1692_wzxaqx.jpg",
  "v1714330292/landscapes/_DSC5491_qcyspj.jpg",
  "v1714330294/landscapes/_DSC5608_yij1tw.jpg",
  "v1714329520/landscapes/_DSC5682_ja1oqt.jpg",
  "v1714330288/landscapes/_DSC5747_lq32bg.jpg",
  "v1714330284/landscapes/_DSC5757_r0rack.jpg",
  "v1714330294/landscapes/_DSC5770_kwhbsa.jpg",
  "v1714329532/landscapes/_DSC4723_n2j0hr.jpg",
  "v1714330287/landscapes/_DSC4744_aperw8.jpg",
  "v1714329519/landscapes/_DSC9067_fpndw7.jpg",
  "v1714329539/landscapes/_DSC9193_n8yqdq.jpg",
  "v1714330301/landscapes/_DSC6402_kjzcao.jpg",
  "v1714329505/landscapes/_DSC6453_syfatz.jpg",
  "v1714330318/landscapes/_DSC8905-Pano_lkmwij.jpg",
  "v1714329515/landscapes/_DSC9521_liyhyr.jpg",
  "v1714329509/landscapes/DSC_0240_dsojbt.jpg",
  "v1714329528/landscapes/_DSC9243_h5emih.jpg",
  "v1714329529/landscapes/_DSC9430_u6gy9s.jpg",
  "v1714330323/landscapes/DSC_0268_hinajy.jpg",
  "v1714329512/landscapes/DSC_2259_txevgt.jpg",
  "v1714330320/landscapes/DSC_2282-2_copy_ucinuy.jpg",
  "v1714330313/landscapes/DSC_2342_ijbwca.jpg",
  "v1714330301/landscapes/DSC_2358_uok8t5.jpg",
  "v1714329517/landscapes/DSC_2478-2_prcn0l.jpg",
  "v1714330297/landscapes/DSC_3226_hq28qn.jpg",
  "v1714329527/landscapes/DSC_2589_cdk7ri.jpg",
  "v1714330317/landscapes/DSC_3728_ajbax1.jpg",
  "v1714330308/landscapes/DSC_4393_j0kvuu.jpg",
  "v1714329518/landscapes/DSC_8745_guqgjp.jpg",
  "v1714330320/landscapes/DSC_9955_uf5swx.jpg",
  "v1714329524/landscapes/DSC_9160_qbnff8.jpg",
  "v1714330304/landscapes/DSC_3580_wlpvou.jpg",
  "v1714329521/landscapes/DSC_3596_iz4wfj.jpg",
  "v1714330305/landscapes/DSC_3739_vg1sbb.jpg",
  "v1714330315/landscapes/DSC_4562_dcfb1o.jpg",
  "v1714330306/landscapes/DSC_5620_sfkpni.jpg",
  "v1714330282/landscapes/DSC_6611_k7bwyq.jpg",
  "v1714330296/landscapes/DSC_8438_wdmmcv.jpg"
];

function LandscapeGallery(props) {
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
          Landscapes
        </Typography>
        <Typography variant="h6" align="center">
          My favorite umbrella term for everything that isn't the rest of these categories.
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

export default LandscapeGallery;
