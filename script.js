function saveDaily(){
  const v = dailyInput.value.trim();
  if(!v) return alert('Daily empty');

  fetch('update.php',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      password:"damodar@123",
      daily:v
    })
  })
  .then(r=>r.json())
  .then(res=>{
    if(res.status==="success"){
      dailyOut.value="SAVED ON SERVER: "+v;
    }else{
      alert("Server error");
    }
  });
}
