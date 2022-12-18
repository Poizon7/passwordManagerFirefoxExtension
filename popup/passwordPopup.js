const hidePage = `body > :not(.beastify-image) {
                    display: none;
                  }`;

function listenForClicks() {
  document.querySelector("#get").addEventListener("click", (e) => {
    function beastify(tabs) {
      let site = document.querySelector("#getSite").value;
      let masterPassword = document.querySelector("#getMasterPassword").value;

       browser.tabs.sendMessage(tabs[0].id, {
          command: "get",
          site: site,
          masterPassword: masterPassword
       });
    }

    function reportError(error) {
      console.error(`Could not beastify: ${error}`);
    }

    browser.tabs
      .query({ active: true, currentWindow: true })
      .then(beastify)
      .catch(reportError);
  });

  document.querySelector("#set").addEventListener("click", (e) => {
    function beastify(tabs) {
      let site = document.querySelector("#setSite").value;
      let password = document.querySelector("#setPassword").value;
      let masterPassword = document.querySelector("#setMasterPassword").value;

       browser.tabs.sendMessage(tabs[0].id, {
          command: "set",
          site: site,
          password: password,
          masterPassword: masterPassword
       });
    }

    function reportError(error) {
      console.error(`Could not beastify: ${error}`);
    }

    browser.tabs
      .query({ active: true, currentWindow: true })
      .then(beastify)
      .catch(reportError);
  });
  document.querySelector("#getButton").addEventListener("click", (e) => {
    let div = document.querySelector("#getContainer");

    if (div.classList.contains("hidden")) {
      div.classList.remove("hidden");
    }

    div = document.querySelector("#setContainer");

    if (!div.classList.contains("hidden")) {
      div.classList.add("hidden");
    }
  });
  
  document.querySelector("#setButton").addEventListener("click", (e) => {
    let div = document.querySelector("#setContainer");

    if (div.classList.contains("hidden")) {
      div.classList.remove("hidden");
    }

    div = document.querySelector("#getContainer");

    if (!div.classList.contains("hidden")) {
      div.classList.add("hidden");
    }
  });
}

function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute beastify content script: ${error.message}`);
}

browser.tabs.executeScript({ file: "../content_script/passwordManager.js" })
  .then(listenForClicks)
  .catch(reportExecuteScriptError);

browser.runtime.onMessage.addListener((message) => {
  if (message.hasOwnProperty('password')) {
    document.querySelector("#password").innerText = message.password;
  } else if (message.hasOwnProperty('status')) {
    if (message.status) {
      document.querySelector("#status").innerText = "Succeded";
    } else {
      document.querySelector("#status").innerText = "Error";
    }
  }
})
