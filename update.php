<?php
/* ===== DAMODAR ADMIN UPDATE API ===== */

header('Content-Type: application/json');

$ADMIN_PASSWORD = "damodar@123";   // 🔴 change here
$DATA_FILE = "data.json";

$input = json_decode(file_get_contents("php://input"), true);

if(!$input || !isset($input['password'])){
  http_response_code(403);
  echo json_encode(["error"=>"Unauthorized"]);
  exit;
}

if($input['password'] !== $ADMIN_PASSWORD){
  http_response_code(403);
  echo json_encode(["error"=>"Wrong password"]);
  exit;
}

/* ===== LOAD EXISTING DATA ===== */
$data = file_exists($DATA_FILE)
  ? json_decode(file_get_contents($DATA_FILE), true)
  : ["daily"=>"","current"=>[],"history"=>[]];

/* ===== UPDATE FIELDS ===== */
if(isset($input['daily']))   $data['daily'] = $input['daily'];
if(isset($input['current'])) $data['current'] = $input['current'];
if(isset($input['history'])) $data['history'] = $input['history'];

file_put_contents($DATA_FILE, json_encode($data, JSON_PRETTY_PRINT));

echo json_encode(["status"=>"success"]);
