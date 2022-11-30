// import core from '@actions/core';
import github from '@actions/github';
import { doAction } from './_action.js';

const trelloApiKey = process.env['TRELLO_API_KEY'];
const trelloApiToken = process.env['TRELLO_API_TOKEN'];
const boardId = process.env['TRELLO_BOARD_ID'];
const todoListId = process.env['TRELLO_TODO_LIST_ID'];
const doingListId = process.env['TRELLO_DOING_LIST_ID'];
const doneListId = process.env['TRELLO_DONE_LIST_ID'];
const prefix = process.env['PREFIX'];

const issue = github.context.payload.issue;
const pullRequest = github.context.payload.pull_request;

(async () =>
  await doAction({
    boardId,
    todoListId,
    doingListId,
    doneListId,
    trelloApiKey,
    trelloApiToken,
    issue,
    pullRequest,
    prefix
    dev: false,
  }))();
