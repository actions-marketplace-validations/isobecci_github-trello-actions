import {
  getTrello,
  createACardWithParams,
  createAttachmentOnCard,
  moveACard,
} from './_trello.js';

export async function doAction(
  boardId,
  todoListId,
  doingListId,
  doneListId,
  trelloApiKey,
  trelloApiToken,
  issue,
  pullRequest,
  dev,
) {
  try {
    // if (dev) console.log({ boardId, todoListId, doingListId, doneListId });
    if (dev)
      console.log({
        type: 'board',
        boardId,
        fields: 'members',
        trelloApiKey,
        trelloApiToken,
      });

    const members = await getTrello(
      'board',
      boardId,
      'members',
      trelloApiKey,
      trelloApiToken,
    );

    if (dev) console.log(members);

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
      const issueNumbers = pullRequest.body
        ?.match(/(^|,?\s*)(#[0-9]+?)(\s*,?\s|$)/g)
        ?.map((i) => i.trim());
      if (dev) console.log({ issueNumbers });
      if (issueNumbers?.length) {
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
        if (dev) console.log(cards.map((card) => card.name));
        const targetCards = new Set();
        for (let issueNumber of issueNumbers) {
          if (dev) console.log(new RegExp(`\\[\\${issueNumber}\\]`, 'i'));
          const { id: cardId } = cards.find(({ name }) =>
            new RegExp(`\\[\\${issueNumber}\\]`, 'i').test(name),
          ) || { id: null };
          cardId && targetCards.add(cardId);
        }
        if (dev) console.log(targetCards);
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
}
