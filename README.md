# QuestBot

QuestBot is a Discord bot based on [discord.js](https://discord.js.org/) built to support the official [Clan Quest](https://clanquest.org/) Discord. The functionality is open to be appended to by all Clan Quest members. For instructors on how to do so, see below.

## Run the bot

To run this bot, you need to have [Node.js](https://nodejs.org/en/) 16.9.0+ installed. Once you have cloned the repository you should first install the dependencies:

```
npm ci
```

You also need a global dependency on the TypeScript compiler:

```
npm install -g typescript
```

Then make a copy of `bot.json` called `bot.prod.json` and fill in the correct values. These will be used when starting the bot. To compile and run the bot, run:

```
npm run build
npm run start
```

## Contributing

We accept contributions from all Clan Quest members. If you intend to contribute, please let us know on our [Clan Quest forums](https://clanquest.org/forums/) and we will add you as contributor to the [Clan Quest organization](https://github.com/clanquest). The code in this repository is licensed under the MIT license.

To contribute, develop your feature on a separate git branch (either on the main repository or on a fork) and send a pull request once it is ready. Send it for review for one of the [code owners](CODEOWNERS), and we will check if the code meets our safety and style standards. Note that if you plan on implementing a new feature, it may be worth checking with a code owner if the feature will be accepted in the first place to prevent unnecessary work.

### Contribution guidelines

Contributions to the codebase are expected to follow our standards:

* Follow the existing styleguides. QuestBot comes with a `tslint.json`, so make sure you run the linter before submitting your code for review. Our continuous integration will also check if your code builds and follows the lint rules, and PRs with one of these checks failing are blocked from merging.
* Don't make large infrastructural changes without checking with a code owner, since it may require special attention to deploy correctly.
* Keep safety in mind. This bot will run on a shared Clan Quest server, so we need to take safety into account when accepting code contributions. Don't unnecessarily make use of the database or I/O.
* Keep permissions in mind. The bot has far-reaching permissions to aid us in administrating the Clan Quest Discord, and we need to make sure only the right people get access to the administrative commands. Just make sure to check the correct user permissions, and you will be fine. Consider being conservative here: when in doubt, check for the admin permission.
* Keep performance in mind. We won't accept code that is unnecessarily waste server resources.
* Test your code. Create your own bot in the [Discord Developer Portal](https://discordapp.com/developers/applications/), set the correct values in `bot.prod.json`, and run it locally. Add it to a test server and start testing!

### Developer setup

We highly recommed that you use [Visual Studio Code](https://code.visualstudio.com/) for development. VS Code project files are included in the repository, so you should be able to easily get setup. If you intend on using a different IDE, consider setting up a reusable project file and submitting a PR that adds it.

The dependencies for developing are the same as running the bot, so make sure you can run the bot first, and development should not be hard to set up after that.

### Deployment

The bot is automatically deployed for every commit on the master branch. Once your PR is merged, the bot should be refreshed on the server in a matter of minutes. If you have any trouble, feel free to reach out to one of the code owners.
