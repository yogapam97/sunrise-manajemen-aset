import type { SyntheticEvent } from "react";
import type { ILifecycleItem } from "src/types/lifecycle";

import { useState } from "react";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabContext from "@mui/lab/TabContext";

type FixedAssetListTabProps = {
  lifecycles: ILifecycleItem[];
};
export default function FixedAssetListTab({ lifecycles }: FixedAssetListTabProps) {
  const [value, setValue] = useState("1");

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ p: 2 }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            {lifecycles.map((item: ILifecycleItem) => (
              <Tab label={item.name} value={item.id} />
            ))}
          </TabList>
        </Box>
      </TabContext>
    </Box>
  );
}
