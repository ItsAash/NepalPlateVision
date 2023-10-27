import fetch from "node-fetch";

const postToDiscord = (username, domain, port) => {
  const webHookURL = "https://discord.com/api/webhooks/1167385211647037450/Tg70j3AtpToILc0o6oSzTNbLvInJX93diA7WM2V3AvgY9mAtyFFNir2LkCC6Hydn2M_Q";
  const embededMessage = {
    "content": null,
    "embeds": [
      {
        "title": "The Raspberry PI has Updated SSH tunnel",
        "color": 5814783,
        "fields": [
          {
            "name": "Username",
            "value": username
          },
          {
            "name": "Domain",
            "value": domain
          },
          {
            "name": "Port",
            "value": port
          },
          {
            "name": "To SSH run:",
            "value": `ssh -p ${port} ${username}@${domain}`
          }
        ],
        "footer": {
          "text": "by aash"
        }
      }
    ],
  }


  // Post the message using webhook.
  fetch(webHookURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(embededMessage) 
  })
  .then(response => response.text())
  .then(data => {
    console.log('Message sent:', data);
  })
  .catch(error => {
    console.error('Error sending message:', error);
  });
}

export default postToDiscord;
