import { List, ListItem, ListItemText } from "@mui/material";

export default function LegalContact() {
  return (
    <List>
      <ListItem>
        <ListItemText primary="Email: contact@stageholder.com" />
      </ListItem>
      {/* <ListItem>
        <ListItemText primary="Phone: +62 815-1380-8529" />
      </ListItem> */}
      <ListItem>
        <ListItemText primary="Address: Jakarta, Indonesia" />
      </ListItem>
    </List>
  );
}
