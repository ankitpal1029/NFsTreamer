import axios from "axios";
import { Request, Response } from "express";
import { CLIENT_ID } from "../../lib/constants";
import TwitchUser from "../../models/twitch-users";

const TwitchAuthCallback = async (req: Request, res: Response) => {
  const { access_token } = req.query;
  console.log(access_token);
  // send back a cookie with access token

  try {
    const res = await axios.get("https://api.twitch.tv/helix/users", {
      headers: {
        "Client-ID": CLIENT_ID as string,
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
      { id: res.data.data[0].id }
      // (err: any) => {
      //   if (err) {
      //     console.log(err);
      //   } else {
      //     console.log("Twitch User already exists");
      //   }
      // }
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
    secure: true,
    maxAge: 60 * 60 * 1000,
    domain: ".nfstreamer.tech",
  });
  return res.send();
  // use token to get user info and store it in db
};

export default TwitchAuthCallback;
