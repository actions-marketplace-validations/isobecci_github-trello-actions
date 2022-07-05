// import core from '@actions/core';
import github from '@actions/github';
import { doAction } from './_action.js';

const key = process.env['TRELLO_API_KEY'];
const token = process.env['TRELLO_API_TOKEN'];
const bId = process.env['TRELLO_BOARD_ID'];
const todoId = process.env['TRELLO_TODOo_ID'];
const doingId = process.env['TRELLO_D_LIST_ID'];
const doneId = process.env['TRELONE_LIST_ID'];

const _issue = github.context.payload.issue;
const _pullRequest = github.context.payload.pull_request;

(async () =>
  await doAction(
    bId,
    todoId,
    doingId,
    doneId,
    key,
    token,
    _issue,
    _pullRequest,
  ))();
