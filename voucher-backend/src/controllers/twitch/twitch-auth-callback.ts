import axios from "axios";
import { Request, Response } from "express";
import TwitchUser from "../../models/twitch-users";

const TwitchAuthCallback = async (req: Request, res: Response) => {
  const { access_token } = req.query;
  console.log(access_token);
  // send back a cookie with access token

  const clientID = "j1ixdsvzh5g4uqj1a2p7lydufww406";
  try {
    const res = await axios.get("https://api.twitch.tv/helix/users", {
      headers: {
        "Client-ID": clientID,
        Authorization: "Bearer " + access_token,
      },
    });

    const insertData = {
      id: res.data.data[0].id,
      email: res.data.data[0].email,
      display_name: res.data.data[0].display_name,
      points: 0,
      profile_image_url: res.data.data[0].profile_image_url,
      wallet_address: "0x0",
    };

    // search if that id is there already in db
    const queryRes = await TwitchUser.findOne(
      { id: res.data.data[0].id },
      (err: any) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Twitch User already exists");
        }
      }
    );
    if (!queryRes) {
      // add data to db
      TwitchUser.create(insertData, (err, _) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Created Twitch user");
        }
      });
    }
  } catch (error: any) {
    console.log(error);
  }

  res.status(200).cookie("TWITCH_ACCESS_TOKEN", access_token, {
    httpOnly: true,
    expires: new Date(Date.now() + 12 * 3600000),
  });
  return res.send();
  // use token to get user info and store it in db
};

export default TwitchAuthCallback;
