function loadResult(){
  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      document.getElementById("mainResult").innerText = data.result;
      document.getElementById("updateTime").innerText =
        "Updated: " + data.updated_at;
    });
}

loadResult();
