import { Avatar, Box, CardMedia, List, ListItem } from "@mui/material";

interface MessageExample {
  primary: string;
  secondary: string;
  nft: string;
}

const messageExamples: readonly MessageExample[] = [
  {
    primary: "Brunch this week?",
    secondary:
      "I'll be in the neighbourhood this week. Let's grab a bite to eat",
    nft: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2",
  },
];
export default function MyNFTs() {
  return (
    <List>
      {messageExamples.map(({ primary, secondary, nft }, index) => (
        <ListItem button key={index}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Avatar alt="Profile Picture" />
            <CardMedia
              component="img"
              alt="nft preview"
              image={nft}
              height="100"
              width="50"
            />
          </Box>
          {/*<ListItemText primary={primary} secondary={secondary} />*/}
        </ListItem>
      ))}
    </List>
  );
}
