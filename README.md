## Updating the layout

**Set-up Kalamine**:
- `git clone https://github.com/qwerty-fr/kalamine`.
- `cd kalamine`
- `pip3 install click==8.0.0 PyYAML==5.1.2 lxml==4.6.3`

**Update the JSON**
- Get [`qwerty-fr.yaml`](https://github.com/qwerty-fr/qwerty-fr/blob/master/qwerty-fr.yaml) from the main repo.
- `python3 -m kalamine.cli --out qwerty-fr.json qwerty-fr.yaml`

## Running

- Install [Node.js](https://nodejs.org/en/).
- Run `npx http-server`.
- Open the displayed link in the browser.