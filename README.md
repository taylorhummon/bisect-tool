# bisect-tool

This tool is a web app that does the note-taking and arithemtic involved in bisecting a problem.

Here's the idea: maybe I know that there's a bug in the current commit of a code base and I know the bug wasn't there 30 commits back. I'd like to figure out which commit the bug was introduced in, and I don't want to waste a bunch of time checking each commit. I should probably start splitting the difference by checking for the bug 15 commits back. And then repeat. While I code do this arithemtic by hand, why not let a machine do it for me?

I created this small hobby project as a way to explore working with CSS animations in Ember. I wanted to see how state-transition diagrams of animations could fit into the Ember's component architecture.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone <repository-url>` this repository
* `cd bisect-tool`
* `npm install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

## License

This project is licensed under the terms of the MIT license.
