import { McpServer, ResourceTemplate }
  from "@modelcontextprotocol/sdk/server/mcp.js";

import { StdioServerTransport }
  from "@modelcontextprotocol/sdk/server/stdio.js";

import { z }
  from "zod";

//
// MCP server for the Moltbook Social Network for LLMs
//

// Create an MCP server

const server = new McpServer({
  name: "moltbook",
  version: "1.0.0"
});

//
// Get an API key for Moltbook from an environment variable
//

const moltbook_api_key = process.env.MOLTBOOK_API_KEY;

if (!moltbook_api_key)
{
  console.error("MOLTBOOK_API_KEY not set");
}

//
// Tools
//

//
// Deep Research MCP clients expect the server to provide tools called
// "search" and "fetch".
//

//
// Fetch
//
// The LLM is expecting the result to be: {name, title, text, uri}
//
// If we return a resource, rather than a text block containing the JSON
// the LLM is expecting, the glue logic between the LLM and MCP is
// responsible for turning the fields in the resource into the above form.
//
//

server.registerTool("fetch",
  {
    title: "Fetch",
    description: "Retrieve a post or comment from Moltbook by ID",
    inputSchema: {
      target_type: z.enum(["posts", "comments"]),
      target_id: z.string()
    }
  },
  async ({ target_type, target_id }) => {
    const response = await fetch(
      `https://www.moltbook.com/api/v1/${target_type}/${target_id}`,
        {
          headers: {
            Authorization: `Bearer ${moltbook_api_key}`
          }
        }
      );

    if (!response.ok) {
      const error_data = await response.text();
      return {
        content: [{
          type: "resource",
          resource: {
            name: `${target_id}`,
            title: "HTTP Error",
            mimeType: "text/plain",
            text: error_data,
            uri: `https://www.moltbook.com/api/v1/${target_type}/${target_id}`
          }
        }],
        isError: true
      }
    }

    const post = await response.json();

    if (!post.success) {
      return {
        content: [{
          type: "resource",
          resource: {
            name: `${target_id}`,
            mimeType: "text/plain",
            text: "",
            uri: `https://www.moltbook.com/api/v1/${target_type}/${target_id}`
          }
        }],
        isError: true
      };
    }

    return {
      content: [{
        type: "resource", 
        resource: {
          name: `${target_id}`,
          title: post["post"]["title"],
          mimeType: "text/markdown",
          text: post["post"]["content"],
          uri: `https://www.moltbook.com/api/v1/${target_type}/${target_id}`
        }
      }]
    }
  }
);

//
// Search
//
// Returns a list of {id, title, text, uri}
// text is a snippet, not the whole document
//
//

server.registerTool("search",
  {
    title: "Search posts and comments",
    description: "Search posts or comments for matching documents",
    inputSchema: {
      target_type: z.enum(["posts", "comments"]),
      query: z.string()
    }
  },
  async ({ target_type, query }) => ({
    content: [{ type: "text", text: "[{\"id\":\"id-goes-here\", \"title\":\"Title Goes Here\", \"text\":\"Text goes here\", \"uri\":\"file:///moltbook/xxx\"}]" }]
  })
);

server.registerTool("get_feed",
  {
    title: "Feed",
    description: "Feed of recent posts",
    inputSchema: {
      community: z.string(),
      sort: z.enum(["new", "top"])
    }
  },
  async ({ community, sort }) => {
    const endpoint =
      `https://www.moltbook.com/api/v1/posts?submolt=${community}&sort=${sort}`;

  const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${moltbook_api_key}`,
          "Content-Type": "application/json"
      },
   });

  const result = await response.json();

    return {
      content: [{
        type: "resource",
         resource: {
           name: result.posts[0].id,
           title: result.posts[0].title,
           mimeType: "text/json",
           text: result.posts[0].content,
           uri: "file://feed"
         }
      }]
    }
  }
);

server.registerTool("vote",
  {
    title: "Vote on Content",
    description: "Upvote or downvote a post or comment",
    inputSchema: {
      target_type: z.enum(["posts", "comments"]),
      target_id: z.string(),
      sentiment: z.enum(["upvote", "downvote"])
    }
  },
  async ({ target_type, target_id, sentiment }) => {
    const endpoint =
      `https://www.moltbook.com/api/v1/${target_type}/${target_id}/${sentiment}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${moltbook_api_key}`,
          "Content-Type": "application/json"
      },
      body: "{}"
    });

    const result = await response.json();

    if (!response.ok) {
      const error_data = await response.text();
      return {
        content: [{
          type: "resource",
          resource: {
            name: "Vote error",
            title: "HTTP Error",
            mimeType: "text/plain",
            text: error_data,
            uri: endpoint
          }
        }],
        isError: true
      }
    }

    return {
      content: [{
        type: "resource",
        resource: {
          name: "name goes here",
          title: "Vote Successful",
          mimeType: "text/plain",
          text: result.message,
          uri: "file://uri"
        }
      }]
    };
  }
);

server.registerTool("check_account_status",
  {
    title: "Check account status",
    description: "Check if the user has completed creating the account",
    inputSchema: { }
  },
  async ({ }) => {
    const response = await fetch(
      "https://www.moltbook.com/api/v1/agents/status",
        {
          headers: {
            Authorization: `Bearer ${moltbook_api_key}`
          }
        }
      );

    const status = await response.text();

    return {
      content: [{
        type: "resource",
        resource: {
          name: "agent_status",
          title: "Agent Status",
          mimeType: "text/json",
          text: status,
          uri: "https://www.moltbook.com/api/v1/agents/status"
        }
      }]
    }
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
server.connect(transport);
