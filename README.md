### Webex MCP Server

A TypeScript implementation of a Model Context Protocol (MCP) server that integrates with Webex's API.

## Prerequisites

* Node.js 16.x or higher
* NPM or yarn
* A Webex access token

#### Installation
1. Clone the repository from GitHub
``` BASH
git clone https://github.com/bharath063/webex-mcp
```
2. Install dependencies
``` BASH
npm install
```
3. Build the project
``` BASH
npm run build
```
After building, a dist/index.js file will be generated. You can then configure this file with Claude Desktop and other applications. For detailed configuration instructions, please refer to the Usage section.
4. (Optional) Test server with MCP Inspector:
First, create a .env file in the project root directory with your WEBEX_ACCESS_TOKEN:
``` BASH
WEBEX_ACCESS_TOKEN=your_webex_access_token
```
Then run the following command to start the MCP Inspector:

``` BASH
npm run inspect
```
After running the command, MCP Inspector will be available at http://localhost:5173 (default port: 5173). Open this URL in your browser to start testing.

### Usage
Connecting to Claude Desktop
Add this to your Claude Desktop configuration file (~/Library/Application Support/Claude/claude_desktop_config.json on macOS or %APPDATA%\Claude\claude_desktop_config.json on Windows):
``` json
{
  "mcpServers": {
    "webex": {
      "command": "node",
      "args": ["/absolute/path/to/webex-mcp/dist/index.js"],
      "env": {
        "WEBEX_ACCESS_TOKEN": "your_webex_access_token"
      }
    }
  }
}
```
After updating your configuration file, you need to restart Claude for Desktop. Upon restarting, you should see a hammer icon in the bottom right corner of the input box. For more detailed information, visit the [official MCP documentation](https://modelcontextprotocol.io/quickstart/user)

### Development
#### Project Structure
```
webex-mcp/
├── src/
│   ├── index.ts        # Main server entry point
├── package.json
├── tsconfig.json
└── .env.example
```

### License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.