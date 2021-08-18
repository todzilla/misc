#!/bin/php
<?php

require_once('functions.library');
/*
function multiply($a,$b) {
 return($a*$b);
}
*/
#print("$argc\n");

# Check that we have at leat two arguments to work with
# including the program name
if($argc <= 2) {
  print("You need to pass in at least two numeric arguments..\n");
  exit;
}

print("running $argv[0]\n");
$a=$argv[1];
$b=$argv[2];

$result=multiply($a,$b);
print("$result\n");

exit;

/*
print("arg c $argc\n");
print("arg 0 $argv[0]\n");
print("arg 1 $argv[1]\n");
print("arg 2 $argv[2]\n");
*/


exit;
?>
