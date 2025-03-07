# Let's Do Digital Website

Please see the [website](https://letsdodigital.org).

## Editors

We are going to be stopping pushing directly to main shortly. Please start using branches to push your work to the repository. Github Actions has now been set up as below.

### Non-Main Branch

On pushing to a non-main branch, GitHub actions will:

1. Check the formatting of typescript files.
2. Lint check the typescript files.
3. Check the formatting of markdown files.
4. Create the Quarto static pages for further testing.
5. Check that all internal and external urls are valid.
6. Create a draft pull request for the branch.

Please ask someone to review your pull request (PR). The person reviewing show check over any commits, convert the PR to reviewed (from draft) and then merge, if you are happy. If the reviewer has any comments to make about the code before merging, please contact the original PR author to manage these.

As an author, if you are only making very minor changes, you can merge it yourself.

## Main Branch

Once a branch has been merged into main, another GitHub action will run. This will:

1. Run steps 1-5 above again.
2. If the above fails, then the merge will be reverted.
3. If the above passes, then the Quarto pages will be created and pushed to the `gh-pages` branch.
4. `gh-pages` will then be pushed to the website.
