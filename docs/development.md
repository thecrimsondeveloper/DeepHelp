# Development

## Local inspection

Obtain the default branch through an authorized clone. There is no package.json or npm build step on this branch. Serve the repository directory with any available local static HTTP server. For example, if Python 3 is installed:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/` and inspect console/network behavior. This is a suggested local inspection route, not a browser test already performed. Keep API keys absent for initial UI inspection; DeepHelp live requests require explicit service authorization and may incur API usage.

## Contributions and deployment

Keep app.js, index.html, and styles/assets consistent with their actual DOM contract. Do not add React/npm instructions based on repository naming or another branch. No supported production deployment, backend integration, or release pipeline was established. Record browser results before claiming compatibility.

## Source evidence

- [index.html](https://github.com/thecrimsondeveloper/DeepHelp/blob/eb87b94fd3c9b8ea3241e4a64215d1352d529781/index.html)
