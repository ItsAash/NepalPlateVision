import fetch, { Headers } from 'node-fetch';


const fetchTunnels = async () => {
  const API_KEY = process.env.NGROK_API_KEY;
  const response = await fetch("https://api.ngrok.com/tunnels", {
    method: 'get',
	  headers: {'Authorization': `Bearer ${API_KEY}`, 'Ngrok-Version': "2"}
  });

  if(!response.ok) {
    throw Error(reponse.message);
  } 

  const json = await response.json();
  return json;
}

export default fetchTunnels;
