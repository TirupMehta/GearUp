# Contributing to ShopGenie AI

First off, thank you for considering contributing to ShopGenie AI! It's people like you that make this tool great for MSMEs around the world.

## Where do I go from here?

If you've noticed a bug or have a feature request, make sure to check our [Issues](../../issues) to see if someone else in the community has already created a ticket. If not, go ahead and [make one](../../issues/new)!

## Fork & create a branch

If this is something you think you can fix, then [fork ShopGenie AI](../../fork) and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):

```sh
git checkout -b 325-add-dark-mode-toggle
```

## Get the test suite running

Make sure you have Node.js and MongoDB installed.

1. **Install dependencies:**
   * Frontend: Run `npm install` in the root directory.
   * Backend: Run `npm install` inside the `backend/` directory.

2. **Run the application locally:**
   * Start the backend: `cd backend && node server.js`
   * Start the frontend: `npm run dev`

Make sure your changes don't break the existing modules or React components. 

## Implement your fix or feature

At this point, you're ready to make your changes! Feel free to ask for help; everyone is a beginner at first. 

## Code Style

- We use **Prettier** and **ESLint** for code formatting. Please ensure your code follows the established style by running `npm run lint` before committing.

## Make a Pull Request

At this point, you should switch back to your main branch and make sure it's up to date with ShopGenie AI's main branch:

```sh
git remote add upstream https://github.com/TirupMehta/GearUp.git
git checkout main
git pull upstream main
```

Then update your feature branch from your local copy of main, and push it!

```sh
git checkout 325-add-dark-mode-toggle
git rebase main
git push --set-upstream origin 325-add-dark-mode-toggle
```

Finally, go to GitHub and [make a Pull Request](../../compare) :D

## Keeping your Pull Request updated

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code has changed, and that you need to update your branch so it's easier to merge.

Feel free to ask for help on how to rebase!
