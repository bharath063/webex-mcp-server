import { config } from "dotenv";
import { FastMCP, UserError, Content } from "fastmcp";
import { z } from "zod";

config(); // load environment variables from .env file

const server = new FastMCP({
  name: "Webex",
  version: "0.0.1",
});

registerTools(server);

// Start the server
async function main() {
  try {
    await server.start({
      transportType: "stdio",
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

// Register Tools
function registerTools(server: FastMCP) {
  registerListSpacesTool(server);
  registerSendMessageToSpaceTool(server);
  registerCreateMeetingsTool(server);
}

// Register Tools
function registerListSpacesTool(server: FastMCP) {
  server.addTool({
    name: "webex_list_spaces",
    description: "List Webex spaces",
    parameters: z.object({}),
    execute: async (args, { log, reportProgress }) => {
      let resp = await fetch("https://api.ciscospark.com/v1/rooms?sortBy=lastactivity&max=10", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.WEBEX_ACCESS_TOKEN}`,
        },
      });

      if (!resp.ok) {
        throw new UserError("Failed to fetch spaces");
      }
      let data = await resp.json();
      log.info("Fetched spaces successfully", data);
      reportProgress({ progress: 100 });
      return {
        content: data.items.map((space: { id: string; title: string }) => ({
          type: "text",
          text: `Space Name: ${space.title}, Space ID: ${space.id}`,
        })),
      };
    },
  });
}

function registerSendMessageToSpaceTool(server: FastMCP) {
  server.addTool({
    name: "webex_send_message_to_space",
    description: "Send a message to a Webex space",
    parameters: z.object({
      spaceId: z.string().describe("The URL of the image to show"),
      text: z.string().describe("The text to send"),
    }),
    execute: async (args, { log, reportProgress }) => {
      let resp = await fetch(`https://api.ciscospark.com/v1/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WEBEX_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: args.spaceId,
          text: args.text,
        }),
      });

      if (!resp.ok) {
        throw new UserError("Failed to send message");
      }
      let data = await resp.json();
      log.info("Message sent successfully", data);
      reportProgress({ progress: 100 });
      return {
        content: [
          {
            type: "text",
            text: `Successfully sent message: ${args.spaceId} \n Text: ${args.text}`,
          },
        ],
      };
    },
  });
}

function registerCreateMeetingsTool(server: FastMCP) {
  server.addTool({
    name: "webex_create_meeting",
    description: "Create a Webex meeting",
    parameters: z.object({
      title: z.string().describe("The title of the meeting"),
      startTime: z.string().describe("The start time of the meeting"),
      endTime: z.string().describe("The end time of the meeting"),
      roomId: z.string().describe("The ID of the room for the meeting"),
    }),
    execute: async (args, { log, reportProgress }) => {
      let resp = await fetch("https://api.ciscospark.com/v1/meetings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WEBEX_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: args.title,
          roomId: args.roomId,
          startTime: args.startTime,
          endTime: args.endTime,
        }),
      });

      if (!resp.ok) {
        throw new UserError("Failed to create meeting");
      }
      let data = await resp.json();
      log.info("Meeting created successfully", data);
      reportProgress({ progress: 100 });
      return {
        content: [
          {
            type: "text",
            text: `Successfully created meeting with ID: ${data.id}`,
          },
        ],
      };
    },
  });
}