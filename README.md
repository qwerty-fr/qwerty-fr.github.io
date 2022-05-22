## Updating the layout

**Set-up Kalamine**:
- `git clone https://github.com/qwerty-fr/kalamine`.
- `cd kalamine`
- `poetry install`

**Update the JSON**
- Get [`qwerty-fr.yaml`](https://github.com/qwerty-fr/qwerty-fr/blob/master/qwerty-fr.yaml) from the main repo.
- `poetry run kalamine --out qwerty-fr.json qwerty-fr.yaml`
- Move `qwerty-fr.json` to the `layouts/` directory of this repo.

## Running

- Install [Node.js](https://nodejs.org/en/).
- Run `npx http-server`.
- Open the displayed link in the browser.
