import { createGitgraph } from "@gitgraph/js";

const developer = "Mike McGrath <mike.mcgrath@slalom.com>";
const maintainer = "Steve Small <steve.small@slalom.com>";
const bot = "semantic-release-bot <semantic-release-bot@arccorp.com>";

// Get the graph container HTML element.
const graphContainer = document.getElementById("graph-container");

// Instantiate the graph.
const gitgraph = createGitgraph(graphContainer);

// Simulate git commands with Gitgraph API.
const master = gitgraph.branch("master");

// Create our first commit, it's typically already there when we get an empty repo.
master.commit({
  subject: "Initial commit",
  author: maintainer
});

// To begin work, a team branches off master into a develop branch
const develop = gitgraph.branch("develop");

// A developer branches from develop to write their feature
const aFeature = gitgraph.branch({
  name: "feature/homepage"
});

// At this point, it doesn't matter if the developer uses structured commits or not, as long as the merge is a squash.
aFeature
  .commit({ subject: "a new page", author: developer })
  .commit({ subject: "this commit is unstructured", author: developer });

// Merge the first feature into the develop branch.  This commit message matters!
develop.merge({
  branch: aFeature,
  commitOptions: {
    subject: "feat(home): add a homepage",
    body: "Merged in feature/homepage (pull request #1)",
    author: maintainer
  }
});

// Ready to test our first release, we branch develop into a "release/next" branch
const next = gitgraph.branch({
  name: "release/next",
  from: develop,
  style: {
    color: "purple",
    label: {
      color: "purple",
      strokeColor: "purple"
    }
  }
});

// semantic-release is configured to tag pre-releases and build a changelog
next.commit({
  subject: "chore(release): 1.0.0-rc.1 [skip ci]",
  author: bot,
  style: { dot: { color: "purple" }, message: { color: "purple" } }
});
next.tag({
  name: "v1.0.0-rc.1",
  style: {
    bgColor: "purple"
  }
});

// When the release candidate has been validated (UAT?), merge release/next into master (merge commit, do not squash)
master.merge({
  branch: next,
  fastForward: false,
  commitOptions: {
    subject: "chore(release): release first version",
    body: "Merged in develop (pull request #2)",
    author: maintainer
  }
});
// semantic release tags the release version and builds the changelog
master.commit({
  subject: "chore(release): 1.0.0 [skip ci]",
  author: bot
});
master.tag("v1.0.0");

// merge develop back down to master, do not squash
develop.merge({
  branch: master,
  fastForward: false,
  commitOptions: {
    subject: "chore(release): merge down from master",
    body: "Merged in master (pull request #)",
    author: maintainer
  }
});
// Implement a new feature based off develop
const bFeature = gitgraph.branch({
  name: "feature/settings",
  from: develop,
  style: {
    color: "green",
    label: {
      color: "green",
      strokeColor: "green"
    }
  }
});
bFeature
  .commit({
    subject: "I should use a convention",
    author: developer,
    style: { dot: { color: "green" }, message: { color: "green" } }
  })
  .commit({
    subject: "these are settings",
    author: developer,
    style: { dot: { color: "green" }, message: { color: "green" } }
  })
  .commit({
    subject: "But Mom, my settings!",
    author: developer,
    style: { dot: { color: "green" }, message: { color: "green" } }
  });

// Merge the feature, again commit message matters and you must squash.
develop.merge({
  branch: bFeature,
  commitOptions: {
    subject: "feat(home): add a settings page",
    body: "Merged in feature/settings (pull request #)",
    author: maintainer
  }
});

// Update your release branch (or create a new one).  If updating, message matters, do not squash.
next.merge({
  branch: develop,
  fastForward: false,
  commitOptions: {
    subject: "chore(release): update next release",
    body: "Merged in develop (pull request #4)",
    author: maintainer,
    style: { dot: { color: "purple" }, message: { color: "purple" } }
  }
});
// semantic-release sets the pre-release
next.commit({
  subject: "chore(release): 1.1.0-rc.1 [skip ci]",
  author: bot,
  style: { dot: { color: "purple" }, message: { color: "purple" } }
});
next.tag({
  name: "v1.1.0-rc.1",
  style: {
    bgColor: "purple"
  }
});

// Build another feature in off develop
const cFeature = gitgraph.branch({
  name: "feature/vegas",
  from: develop,
  style: {
    color: "red",
    label: {
      color: "red",
      strokeColor: "red"
    }
  }
});
cFeature
  .commit({
    subject: "Vegas mode!",
    author: developer,
    style: { dot: { color: "red" }, message: { color: "red" } }
  })
  .commit({
    subject: "Blinkenlights!",
    author: developer,
    style: { dot: { color: "red" }, message: { color: "red" } }
  })
  .commit({
    subject: "I lost all my money.",
    author: developer,
    style: { dot: { color: "red" }, message: { color: "red" } }
  });

// Bring the new feature into develop.  Message matters, must squash.
develop.merge({
  branch: cFeature,
  commitOptions: {
    subject: "feat(home): add a vegas mode",
    body: "Merged in feature/vegas (pull request #)",
    author: maintainer
  }
});

// Update the release branch again.  Message matters, do not squash.
next.merge({
  branch: develop,
  commitOptions: {
    subject: "chore(release): update next release",
    body: "Merged in develop (pull request #)",
    author: maintainer,
    style: { dot: { color: "purple" }, message: { color: "purple" } }
  }
});

// semantic-release handles another pre-release
next.commit({
  subject: "chore(release): 1.1.0-rc.2 [skip ci]",
  author: bot,
  style: { dot: { color: "purple" }, message: { color: "purple" } }
});
next.tag({
  name: "v1.1.0-rc.2",
  style: {
    bgColor: "purple"
  }
});

// Release to master. Message matters, do not squash.
master.merge({
  branch: next,
  fastForward: false,
  commitOptions: {
    subject: "chore(release): release next version",
    body: "Merged in feature/vegas (pull request #)",
    author: maintainer
  }
});
// semantic-release does it's thing again
master.commit({
  subject: "chore(release): 1.1.0 [skip ci]",
  author: bot
});
master.tag("v1.1.0");
