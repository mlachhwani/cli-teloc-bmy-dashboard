console.log("APP.JS LOADED");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM READY");

  const test = document.getElementById("snapshotDate");

  if (!test) {
    console.error("snapshotDate element NOT FOUND");
    return;
  }

  test.innerText = "JS WORKING OK";
});
