const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch')
const helpers = require("./helpers")

const DEFAULT_ENV_FILE_EXTENSION = '.env'

try {
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = github.context.payload
  const { pull_request = {} } = payload
  const { url = "" } = pull_request
  if (url) {
    // get all files in current pull request
    fetch(`${url}/files`, {
      headers: {
        authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "content-type": "application/json"
      }
    }).then(resp => resp.json()).then(files => {
      const fileNotValidPattern = files.map(file => {
        const { filename = "", patch = "" } = file
        if (filename.includes(DEFAULT_ENV_FILE_EXTENSION) && helpers.should_exists_debug_env(patch)) {
          return filename
        }
        return ""
      }).filter(filename => filename.length > 0)
      if (fileNotValidPattern.length > 0) {
        const msg = `${DEFAULT_ENV_FILE_EXTENSION} does not match with pattern: APP_DEBUG=true, files: ${fileNotValidPattern.join(',')}`
        core.setFailed(msg);
      }
    })
  }
} catch (error) {
  core.setFailed(error.message);
}