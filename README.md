# Let's Do Digital Website

Please see the [website](https://letsdodigital.org).

## Editors

We are going to be stopping the direct pushing of code to main shortly. Please start using branches to push your work to the repository, where they are automatically converted to pull requests (PRs), which can then be manually accepted and merged into main. Github Actions has now been set up as below.

### Non-Main Branch

On pushing to a non-main branch, GitHub actions will:

1. Check the formatting of typescript files.
2. Lint check the typescript files.
3. Check the formatting of markdown files.
4. Create the Quarto static pages for further testing.
5. Check that all internal and external urls are valid.
6. Create a draft pull request for the branch.

Please ask someone to review your PR. The person reviewing should check over any commits, click on "Ready for Review" (to convert from draft) and then merge, if they are happy to do so. If the reviewer has any comments to make about the code before merging, please contact the original PR author to manage these.

As an author, if you are only making very minor changes, you can merge the PR yourself.

In regards to `url testing`, unfortunately, some sites do not allow automated testing (you will receive a status code 403). To bypass this, please manually check that the url is working, and then add the url to the `allowlistedUrls` array in the `utils/tests/post-render/urls.json` file.

## Main Branch

Once a branch has been merged into main, another GitHub action will run. This will:

1. Run steps 1-5 above again.
2. If the above fails, then the merge will be reverted.
3. If the above passes, then the Quarto pages will be created and pushed to the `gh-pages` branch.
4. `gh-pages` will then be pushed to the `letsdodigital.org` website.
