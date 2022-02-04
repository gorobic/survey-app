<?php

$result = file_put_contents( 'output_data.json', file_get_contents('php://input') );

header("Content-Type: application/json; charset=UTF-8");
echo json_encode($result);