var repoNameEl = document.querySelector("#repo-name");
var issuesContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");

var getRepoName = function () {
  var queryString = document.location.search.split("=")[1];

  if (queryString) {
    getRepoIssues(queryString);
    repoNameEl.textContent = queryString;
  } else {
    document.location.replace("./index.html");
  }
};

var getRepoIssues = function (repo) {
  var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayIssues(data);

        //check if api has more than 30 issues (pagination exists)
        if (response.headers.get("Link")) {
          displayWarning(repo);
        }
      });
    } else {
      alert("There was a problem with your request. Returning to home page.");
      document.location.replace("./index.html");
    }
  });
};

var displayIssues = function (issues) {
  if (issues.length === 0) {
    issuesContainerEl.textContent = "This repository has no open issues!";
    return;
  }

  for (var i = 0; i < issues.length; i++) {
    //create a link el to take users to the issue on github
    var issueEl = document.createElement("a");
    issueEl.classList = "list-item flex-row justify-space-between align-center";
    issueEl.setAttribute("href", issues[i].html_url);
    issueEl.setAttribute("target", "_blank");

    //create span to hold issue title
    var titleEl = document.createElement("span");
    titleEl.textContent = issues[i].title;

    //append to container
    issueEl.appendChild(titleEl);

    //create a type element
    var typeEl = document.createElement("span");

    //check if issue is an actual issue or a pull request
    if (issues[i].pull_request) {
      typeEl.textContent = "(Pull request)";
    } else {
      typeEl.textContent = "(Issue)";
    }

    //append to container
    issueEl.appendChild(typeEl);
    issuesContainerEl.appendChild(issueEl);
  }
};

var displayWarning = function (repo) {
  //add text to warning container
  limitWarningEl.textContent = "To see more than 30 issues, visit ";

  var linkEl = document.createElement("a");
  linkEl.textContent = "repository issues on Github.com";
  linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
  linkEl.setAttribute("target", "_blank");

  //append to warning container
  limitWarningEl.appendChild(linkEl);
};

getRepoName();
