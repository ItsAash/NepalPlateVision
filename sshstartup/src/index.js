import { Client } from "ssh2";
import fs from "fs";
import "dotenv/config";
import fetchTunnels from  "./fetch-tunnels.js";
import postToDiscord from "./post-to-discord.js";

const conn = new Client();

const raspberryPi = {
  host: "192.168.1.23",
  port: 22,
  username: process.env.SSH_USERNAME,
  password: process.env.SSH_PASSWORD,
};

const ngrokStartupCommand = "ngrok tcp 22";
const ngrokEndCommand = "pkill ngrok";

conn
  .on("ready", function () {
    console.log("Connected to Raspberry Pi");

    

    conn.exec(ngrokStartupCommand, async function (err, stream) {
      if (err) throw err;
    
      try {
        const activeTunnels = await fetchTunnels();

        if(activeTunnels.tunnels.length !== 0) {
          // there is active tunnel running.
          const activeTunnel = activeTunnels.tunnels[0];
          const forwardedUrl = activeTunnel.public_url;

          console.log("The Tunnel successfully started! Now you can ssh globally. Thanks to Ngrok.");
          console.log("Forwarding URL:", forwardedUrl);
          console.log("Forwards To: ", activeTunnel.forwards_to)
          
          let [proto, domain, port] = forwardedUrl.split(':');
          domain = domain.slice(2);

          console.log("To ssh into the machine use command: ");
          console.log(`ssh -p ${port} ${process.env.SSH_USERNAME}@${domain}`);


          // Sending the message to the discord.
          postToDiscord(process.env.SSH_USERNAME, domain, port);
        }
      } catch (e) {
        console.log("There was an error: ", e.message);
      }


      stream
        .on("close", function (code, signal) {
          console.log(`ngrok process closed with code ${code}`)
          conn.exec(`pkill ngrok`);
          conn.end();
        })
    });
  })
  .on("end", function() {
    console.log("SSH Connection Ended!");

    conn.exec('pkill ngrok', function(err, stream) {
      if(err) {
        console.error('Error executing pkill ngrok: ', err);
      }
      stream.on('close', function(code, signal) {
        console.log('pkill ngrok process closed with code ' + code + ' and signal ' + signal);
      })
    })
  })
  .connect(raspberryPi);
