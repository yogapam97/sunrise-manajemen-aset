import { m } from "framer-motion";
import { identicon } from "@dicebear/collection";

import { Box } from "@mui/material";

import useCreateAvatar from "src/hooks/use-create-avatar";

import Image from "src/components/image/image";
import { varTranHover } from "src/components/animate";
import { useLightBox } from "src/components/lightbox";
import Lightbox from "src/components/lightbox/lightbox";

type FixedAssetDetailImagesProps = {
  name: string;
  thumbnail: string | null;
};

export default function FixedAssetDetailThumbnail({
  name,
  thumbnail,
}: FixedAssetDetailImagesProps) {
  const createThumbnail = useCreateAvatar(identicon, {
    rowColor: ["f5f5f5"],
    backgroundColor: ["000"],
    scale: 70,
  });

  const thumbnailSrc = thumbnail || createThumbnail(name as string);

  const slides = [
    {
      src: thumbnailSrc,
    },
  ];

  const {
    selected: selectedImage,
    open: openLightbox,
    onOpen: handleOpenLightbox,
    onClose: handleCloseLightbox,
  } = useLightBox(slides);
  return (
    <>
      <Box gap={1} display="grid">
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
