import { useState } from "react";

import { Box, Avatar } from "@mui/material";

import Scrollbar from "src/components/scrollbar";

import { useAvatarIcon } from "../hook/useAvatarIcon";

type AvatarInputSelectionProps = {
  onAvatarSelect?: (icon: string) => void;
  value: string;
};

export default function AvatarInputSelection({ onAvatarSelect, value }: AvatarInputSelectionProps) {
  const createAvatarIcon = useAvatarIcon({});
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(value);
  const handleAvatarClick = (icon: string) => {
    setSelectedAvatar(icon);
    if (onAvatarSelect) {
      onAvatarSelect(icon);
    }
  };
  const icons = [
    "boxSeam",
    "box",
    "boxes",
    "archive",
    "award",
    "bag",
    "bandaid",
    "bank",
    "basket",
    "basket2",
    "basket3",
    "bell",
    "bicycle",
    "binoculars",
    "book",
    "bookshelf",
    "boombox",
    "bricks",
    "briefcase",
    "brightnessHigh",
    "brush",
    "bucket",
    "bug",
    "building",
    "calculator",
    "camera",
    "cameraReels",
    "cart2",
    "cashCoin",
    "clock",
    "cloud",
    "cloudDrizzle",
    "cloudMoon",
    "alarm",
    "clouds",
    "cloudSnow",
    "coin",
    "compass",
    "controller",
    "cup",
    "cupStraw",
    "dice5",
    "disc",
    "display",
    "doorClosed",
    "doorOpen",
    "dpad",
    "droplet",
    "easel",
    "egg",
    "eggFried",
    "emojiHeartEyes",
    "emojiLaughing",
    "emojiSmile",
    "emojiSmileUpsideDown",
    "emojiSunglasses",
    "emojiWink",
    "envelope",
    "eyeglasses",
    "flag",
    "flower1",
    "flower2",
    "flower3",
    "gem",
    "gift",
    "globe",
    "globe2",
    "handbag",
    "handThumbsUp",
    "hdd",
    "heart",
    "hourglass",
    "hourglassSplit",
    "house",
    "houseDoor",
    "inbox",
    "inboxes",
    "key",
    "keyboard",
    "ladder",
    "lamp",
    "laptop",
    "lightbulb",
    "lightning",
    "lightningCharge",
    "lock",
    "magic",
    "mailbox",
    "map",
    "megaphone",
    "minecart",
    "minecartLoaded",
    "moon",
    "moonStars",
    "mortarboard",
    "mouse",
    "mouse2",
    "newspaper",
    "paintBucket",
    "palette",
    "palette2",
    "paperclip",
    "pen",
    "pencil",
    "phone",
    "piggyBank",
    "pinAngle",
    "plug",
    "printer",
    "projector",
    "puzzle",
    "router",
    "scissors",
    "sdCard",
    "search",
    "send",
    "shop",
    "shopWindow",
    "signpost",
    "signpost2",
    "signpostSplit",
    "smartwatch",
    "snow",
    "snow2",
    "snow3",
    "speaker",
    "star",
    "stoplights",
    "stopwatch",
    "sun",
    "tablet",
    "thermometer",
    "ticketPerforated",
    "tornado",
    "trash",
    "trash2",
    "tree",
    "trophy",
    "truck",
    "truckFlatbed",
    "tsunami",
    "umbrella",
    "wallet",
    "wallet2",
    "watch",
    "webcam",
  ];
  return (
    <Scrollbar sx={{ height: 256 }}>
      <Box sx={{ display: "flex", justifyContent: "center", bgcolor: "primary" }}>
        <Box sx={{ width: 300 }}>
          {icons.map((icon) => (
            <Avatar
              variant="rounded"
              key={icon}
              sx={{
                display: "inline-block",
                margin: 1,
                width: 56,
                height: 56,
                cursor: "pointer",
                border: selectedAvatar === icon ? "3px solid" : "none",
                borderColor: selectedAvatar === icon ? "info.main" : "transparent",
              }}
              src={createAvatarIcon(icon)}
              onClick={() => handleAvatarClick(icon)}
            />
          ))}
        </Box>
      </Box>
    </Scrollbar>
  );
}
