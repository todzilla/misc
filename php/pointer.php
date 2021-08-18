#!/bin/php
<?php

$a = '1';
$b = &$a;    #$b is now pointing to $a
$b = "2$b";  #$b=21 (string) and so is $a since $b is pointing to it
echo "$b\n";




?>
