fetch("data.json")
  .then(res => res.json())
  .then(data => {
    // ऊपर result
    document.querySelectorAll(".live-result").forEach(el => {
      el.innerText = data.result;
    });

    // नीचे result (अगर same class है)
    document.querySelectorAll(".live-result-bottom").forEach(el => {
      el.innerText = data.result;
    });
  });
