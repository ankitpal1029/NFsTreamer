// import axios from "axios";
import axios from "axios";
import { Request, Response } from "express";
import { CLIENT_ID } from "../../lib/constants";
import TwitchUser from "../../models/twitch-users";

const ReturnTwitchUser = async (req: Request, res: Response) => {
  if (!req.cookies["TWITCH_ACCESS_TOKEN"]) {
    // cookie isn't there so generate a new one
    res.send({ error: "Cookie not found" });
  } else {
    const access_token = req.cookies["TWITCH_ACCESS_TOKEN"];
    console.log("Trying to fetch user");
    try {
      const resData = await axios.get("https://api.twitch.tv/helix/users", {
        headers: {
          "Client-ID": CLIENT_ID as string,
          Authorization: "Bearer " + access_token,
        },
      });

      const insertData = {
        id: resData.data.data[0].id,
        email: resData.data.data[0].email,
        display_name: resData.data.data[0].display_name,
        points: 0,
        profile_image_url: resData.data.data[0].profile_image_url,
        wallet_address: "0x0",
      };

      // search if that id is there already in db
      try {
        const queryRes = await TwitchUser.findOne({
          id: resData.data.data[0].id,
        });

        if (!queryRes) {
          // add data to db
          TwitchUser.create(insertData, (err, _) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Created Twitch user");
            }
          });
          res.send({ user: insertData });
        } else {
          res.send({ user: queryRes });
        }
      } catch (error: any) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
    // cookie is there so fetch user and send it back
  }
};

export default ReturnTwitchUser;
