// import core from '@actions/core';
import github from '@actions/github';
import {
  getTrello,
  createACardWithParams,
  createAttachmentOnCard,
  moveACard,
} from './_trello.js';

const trelloApiKey = process.env['TRELLO_API_KEY'];
const trelloApiToken = process.env['TRELLO_API_TOKEN'];
const boardId = process.env['TRELLO_BOARD_ID'];
const todoListId = process.env['TRELLO_TODO_LIST_ID'];
const doingListId = process.env['TRELLO_DOING_LIST_ID'];
const doneListId = process.env['TRELLO_DONE_LIST_ID'];

const issue = github.context.payload.issue;
const pullRequest = github.context.payload.pull_request;
// console.log('issue', issue);
// console.log('pullRequest', pullRequest);

(async () => {
  try {
    const members = await getTrello(
      'board',
      boardId,
      'members',
      trelloApiKey,
      trelloApiToken,
    );
    const labels = await getTrello(
      'board',
      boardId,
      'labels',
      trelloApiKey,
      trelloApiToken,
    );

    if (issue && !pullRequest) {
      const memberIds = members
        .filter(({ username }) =>
          issue.assignees.find(({ login }) => login === username),
        )
        .map(({ id }) => id);
      // TODO: replace Github login to Trello username
      const labelIds = labels
        .filter((label) => issue.labels.find(({ name }) => name === label.name))
        .map(({ id }) => id);
      const params = {
        number: issue.number,
        title: issue.title,
        description: issue.body,
        memberIds,
        labelIds,
      };
      const card = await createACardWithParams(
        todoListId,
        params,
        trelloApiKey,
        trelloApiToken,
      );
      await createAttachmentOnCard(
        card.id,
        issue.html_url,
        trelloApiKey,
        trelloApiToken,
      );
      console.log('issue:open', issue.created_at);
    }

    if (pullRequest) {
      const issueNumbers =
        pullRequest.body && pullRequest.body.match(/(#[0-9]+?)/g);
      if (issueNumbers && issueNumbers.length > 0) {
        const [fromListId, toListId] = pullRequest.closed_at
          ? [doingListId, doneListId]
          : [todoListId, doingListId];
        // get cards
        const cards = await getTrello(
          'lists',
          fromListId,
          'cards?open',
          trelloApiKey,
          trelloApiToken,
        );
        const targetCards = new Set();
        for (let issueNumber of issueNumbers) {
          const { id: cardId } = cards.find(({ name }) =>
            new RegExp(`\\[${issueNumber}\\]`, 'i').test(name),
          ) || { id: null };
          cardId && targetCards.add(cardId);
        }
        targetCards.size &&
          targetCards.forEach(async (cardId) => {
            if (pullRequest.closed_at) {
              console.log('pullRequest:closed', pullRequest.closed_at);
            } else {
              console.log('pullRequest:open', pullRequest.created_at);
              // add attachment (PR) to card
              await createAttachmentOnCard(
                cardId,
                pullRequest.html_url,
                trelloApiKey,
                trelloApiToken,
              );
            }
            // move card
            await moveACard(cardId, toListId, trelloApiKey, trelloApiToken);
          });
      }
    }
  } catch (error) {
    throw new Error(error);
    // core.setFailed(error.message);
  }
})();
