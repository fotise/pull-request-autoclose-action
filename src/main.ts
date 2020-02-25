/* eslint-disable camelcase */
import * as core from '@actions/core'
import * as githubNS from '@actions/github'
import {Context} from '@actions/github/lib/context'
//const github = require('@actions/github');

// import {wait} from './wait'

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('github-token')
    const message: string = core.getInput('message')

    core.debug(new Date().toTimeString())

    const context: Context = githubNS.context
    if (context.payload.pull_request == null) {
      core.debug('No pull request found.')
      return
    }
    const prNumber: number = context.payload.pull_request.number

    const github: githubNS.GitHub = new githubNS.GitHub(token)

    github.issues.createComment({
      ...context.repo,
      issue_number: prNumber,
      body: message
    })
    core.debug(`Created comment: ${message}`)

    await github.pulls.update({
      ...context.repo,
      pull_number: prNumber,
      state: 'closed'
    })
    core.debug(`Closed pull request: ${prNumber}`)

    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
