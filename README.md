# github-trello-actions
You can link GitHub Issues and Pull Request with Trello card.

## Env
`TRELLO_API_KEY`: Your Trello API key

`TRELLO_API_TOKEN`: Your Trello API token

`TRELLO_BOARD_ID`: Your Trello board ID (Short or Long ID)

`TRELLO_TODO_LIST_ID`: Your Trello list ID that a card will be created in when an issue open.

`TRELLO_DOING_LIST_ID`: Your Trello list ID that a card will be moved to when a PR open.

`TRELLO_DONE_LIST_ID`: Your Trello list ID that a card will be moved to when a PR close.

## 1 workflow.yml needed

```yml
name: Trello Integretion

on:
  pull_request:
    types: [opened, closed]
    branches: [ main ]
  issues:
    types: [opened, reopened]

jobs:
  create_trello_card: 
    name: Create Trello Card
    runs-on: ubuntu-latest
    steps:
    - name: Do github-trello-actions
      id: do-github-trello-actions
      uses: isobecci/github-trello-actions@main
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        TRELLO_API_KEY: ${{ secrets.TRELLO_API_KEY }}
        TRELLO_API_TOKEN: ${{ secrets.TRELLO_API_TOKEN }}
        TRELLO_BOARD_ID: ${{ secrets.TRELLO_BOARD_ID }}
        TRELLO_TODO_LIST_ID: ${{ secrets.TRELLO_TODO_LIST_ID }}
        TRELLO_DOING_LIST_ID: ${{ secrets.TRELLO_DOING_LIST_ID }}
        TRELLO_DONE_LIST_ID: ${{ secrets.TRELLO_DONE_LIST_ID }}
```
