import { m } from "framer-motion";

import { Box, Button, Typography } from "@mui/material";

import Image from "src/components/image/image";
import { varTranHover } from "src/components/animate";
import { useLightBox } from "src/components/lightbox";
import Lightbox from "src/components/lightbox/lightbox";

type FixedAssetDetailImagesProps = {
  images: string[];
  withViewMore?: boolean;
  onClickMoreImages?: () => void;
};

export default function FixedAssetDetailImages({
  images,
  withViewMore,
  onClickMoreImages,
}: FixedAssetDetailImagesProps) {
  const listImages = withViewMore ? images.slice(0, 3) : images;
  const slides = listImages.map((slide) => ({
    src: slide,
  }));

  const {
    selected: selectedImage,
    open: openLightbox,
    onOpen: handleOpenLightbox,
    onClose: handleCloseLightbox,
  } = useLightBox(slides);

  const handleClickMoreImages = () => {
    if (onClickMoreImages) {
      onClickMoreImages();
    }
  };

  return (
    <>
      <Box
        gap={1}
        display="grid"
        sx={{
          mt: 2,
          mb: { xs: 12, md: 12 },
        }}
      >
        <Box gap={1} display="grid" gridTemplateColumns="repeat(4, 1fr)">
          {slides.map((slide) => (
            <m.div
              key={slide.src}
              whileHover="hover"
              variants={{
                hover: { opacity: 0.8 },
              }}
              transition={varTranHover()}
            >
              <Image
                alt={slide.src}
                src={slide.src}
                ratio="1/1"
                onClick={() => handleOpenLightbox(slide.src)}
                sx={{ borderRadius: 2, cursor: "pointer" }}
              />
            </m.div>
          ))}
          {withViewMore && images.length > 3 && (
            <Button variant="text" onClick={handleClickMoreImages}>
              <Typography variant="caption">More Images</Typography>
            </Button>
          )}
        </Box>
      </Box>

      <Lightbox
        index={selectedImage}
        slides={slides}
        open={openLightbox}
        close={handleCloseLightbox}
      />
    </>
  );
}
