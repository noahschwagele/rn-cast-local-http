import * as server from "@kccd/expo-http-server";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function App() {
  const [lastCalled, setLastCalled] = useState();
  const [ipAddress, setIpAddress] = useState();
  const port = 9666;

  const html = `
	<!DOCTYPE html>
	<html>
		<body style="background-color:powderblue;">
			<h1>expo-http-server1</h1>
			<p>You can load HTML!</p>
		</body>
	</html>`;

  const obj = { app: "expo-http-server", desc: "You can load JSON!" };

  useEffect(() => {
    // Get the local IP address
    // Setup the server
    server.setup(port, (event: server.StatusEvent) => {
      if (event.status === "ERROR") {
        console.error("1", event);
      } else {
        console.error("2", event);
      }
    });

    // Define routes
    server.route("/", "GET", async (request) => {
      console.log("Request", "/", "GET", request);
      setLastCalled(Date.now());
      return {
        statusCode: 200,
        headers: {
          "Custom-Header": "Bazinga",
        },
        contentType: "application/json",
        body: JSON.stringify(obj),
      };
    });

    server.route("/html", "GET", async (request) => {
      console.log("Request", "/html", "GET", request);
      setLastCalled(Date.now());
      return {
        statusCode: 200,
        statusDescription: "OK - CUSTOM STATUS",
        contentType: "text/html",
        body: html,
      };
    });

    // Start the server
    server.start();

    return () => {
      server.stop();
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text>
        {lastCalled === undefined
          ? "Request webserver to change text"
          : "Called at " + new Date(lastCalled).toLocaleString()}
      </Text>
    </View>
  );
}

