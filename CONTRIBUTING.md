# contributing

hi!! we're very excited that you would like to contribute to `@glitchdotcom/dotenv` and can't
wait to see what you create. this doc should provide a clear guide for you to follow based on
how you'd like to contribute.

## reporting bugs

to submit a bug report, file an issue here on github. here are a few things that would be
helpful to include in your bug report:

1. a description of the issue you're running into.
2. a description of the behaviour you were expecting.
3. clear reproduction steps. in the case of `@glitchdotcom/dotenv`, a code sample would
   be \~amazing\~ (you can use [glitch](https://glitch.com) to make it runnable!).
4. a description of the environment your code is running in. as a few examples: "bundled with
   parcel, running in firefox version 74 on macos 10.15", or "compiled typescript and running
   in node.js 12.16.1 on ubuntu 18.04".

## suggesting improvements

to suggest an improvement, create an issue here on github. note that while we greatly
appreciate and consider all suggestions, not all suggestions will be implemented.

## submitting changes

to submit a change, create a pr here on github. as a courtesy to the person reviewing your pr,
check that all of these are true when creating your pr:

1. the tests on your branch are passing. you can check this by running `npm test`. there will
   also be a ❌ next to your branch name if the tests are failing.
2. if you have fixed a bug or added a feature, you've also added a test to ensure the bug
   remains fixed or that the feature works.
3. if you're adding a feature, you've included in the pr description why you think the feature
   should be added.
4. your code is properly formatted to our project's guidelines. to make this easy we use
   editorconfig and prettier, both of which can probably be added as extensions to your code
   editor so that they are transparent. if you don't wish to add prettier as an extension
   to your code editor, you can run `npm run fmt` in your terminal.
