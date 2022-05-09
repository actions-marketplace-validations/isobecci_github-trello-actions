# trello-github-actions
You can link GitHub Issues and Pull Request with Trello card.

## Env
`TRELLO_API_KEY`: Your Trello API key

`TRELLO_API_TOKEN`: Your Trello API token

`TRELLO_BOARD_ID`: Your Trello board ID (Short or Long ID)

`TRELLO_TODO_LIST_ID`: Your Trello list ID that a card will be created in this list when an issue open.

`TRELLO_DOING_LIST_ID`: Your Trello list ID that a card will be moved to this list when a PR open.

`TRELLO_DONE_LIST_ID`: Your Trello list ID that a card will be moved to this list when a PR close.

## 1 workflow.yml needed

```yml
name: Trello Integretion

on:
  pull_request:
    types: [opened, edited, closed]
    branches: [ main ]
  issues:
    types: [opened, reopened]
  issue_comment: 
    types: [created, edited]

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - run: npm ci
    - run: npm run trello
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        TRELLO_API_KEY: ${{ secrets.TRELLO_API_KEY }}
        TRELLO_API_TOKEN: ${{ secrets.TRELLO_API_TOKEN }}
        TRELLO_BOARD_ID: ${{ secrets.TRELLO_BOARD_ID }}
        TRELLO_TODO_LIST_ID: ${{ secrets.TRELLO_TODO_LIST_ID }}
        TRELLO_DOING_LIST_ID: ${{ secrets.TRELLO_DOING_LIST_ID }}
        TRELLO_DONE_LIST_ID: ${{ secrets.TRELLO_DONE_LIST_ID }}
```
