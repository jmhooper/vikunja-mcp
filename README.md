# vikunja-mcp

An MCP (Model Context Protocol) server for [Vikunja](https://vikunja.io). I built this for my own workflows so the tools are intentionally scoped to what my agents actually need — it's not a full API wrapper. Feel free to fork it and add your own.

The server runs over HTTP and requires a bearer token for authentication.

## Tools

### `list_projects`

Returns all projects in your Vikunja instance.

### `get_tasks`

Returns tasks, optionally scoped to a project.

| Argument       | Type    | Required | Description                                |
| -------------- | ------- | -------- | ------------------------------------------ |
| `project_id`   | number  | No       | Filter tasks to a specific project         |
| `include_done` | boolean | No       | Include completed tasks (default: `false`) |

## Running with Docker

Copy the example env file and fill in your values:

```sh
cp .env.example .env
```

| Variable            | Description                                                            |
| ------------------- | ---------------------------------------------------------------------- |
| `MCP_AUTH_TOKEN`    | Bearer token clients must send to authenticate with this server        |
| `VIKUNJA_BASE_URL`  | Base URL of your Vikunja instance (e.g. `https://vikunja.example.com`) |
| `VIKUNJA_API_TOKEN` | Vikunja API token used to authenticate with the Vikunja API            |
| `LOG_LEVEL`         | Log level: `error`, `warn`, `info`, or `debug` (default: `info`)       |

Then start the server:

```sh
docker compose up
```

The server will be available at `http://localhost:3000/mcp`.
