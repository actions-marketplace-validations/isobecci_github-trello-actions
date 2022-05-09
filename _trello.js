import fetch from 'node-fetch';

export async function getTrello(
  type = '',
  id = '',
  fields = '',
  key = 'trelloApiKey',
  token = 'trelloApiToken',
) {
  try {
    if (!id) throw new Error('Board or List id is required');
    // !fields && (fields = 'cards/open?fields=all&attachments=true'); 
    const url = `https://api.trello.com/1/${type}/${id}/${fields}${ /\?/.test(fields) ? '&' : '?' }key=${key}&token=${token}`;
    // console.log(url);
    const res = await fetch(url, {
      method: 'GET',
    })
    const json = await res.json();
    // console.log(json);
    return json;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createACardWithParams(
  idList = '',
  params = {},
  key = 'trelloApiKey',
  token = 'trelloApiToken',
) {
  try {
    if (!idList) throw new Error('idList is required');
    const res = await fetch(`https://api.trello.com/1/cards?idList=${ idList }&key=${ key }&token=${ token }`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        'name': `[#${ params.number }] ${ params.title }`,
        'desc': params.description,
        'idMembers': params.memberIds,
        'idLabels': params.labelIds,
      }),
    });
    const json = await res.json();
    // console.log(json);
    return json;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createAttachmentOnCard(
  idCard = '',
  attachment = '',
  key = 'trelloApiKey',
  token = 'trelloApiToken',
) {
  try {
    if (!idCard) throw new Error('idCard is required');
    if (!attachment) throw new Error('attachment is required');
    const url = `https://api.trello.com/1/cards/${idCard}/attachments?key=${key}&token=${token}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        url: attachment,
      }),
    })
    const json = await res.json();
    // console.log(json);
    return json;
  } catch (error) {
    throw new Error(error);
  }
}

export async function moveACard(
  idCard = '',
  moveToIdList = '',
  key = 'trelloApiKey',
  token = 'trelloApiToken',
) {
  try {
    if (!idCard) throw new Error('idCard is required');
    if (!moveToIdList) throw new Error('moveToIdList is required');
    const url = `https://api.trello.com/1/cards/${idCard}?key=${key}&token=${token}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        idList: moveToIdList,
      }),
    })
    const json = await res.json();
    // console.log(json);
    return json;
  } catch (error) {
    throw new Error(error);
  }
}
