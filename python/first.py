#!/usr/bin/python

# import
import sys

# var init
one=2

# demonstrating conditionals 
if one==1:
  print("one")
else:
  print("not one but %i" %(one))


# lists
print("-------------------------------")
ints = [0,1,2,3,4,5,6,7,8,9]
ints.append(10)
cnt = len(ints)
print("Count = %i" %(cnt))
ctr=0

while(ctr < cnt):
  print(ints[ctr])
  ctr += 1

# where sys import is required (though it happened automatically)
# maybe version difference
sys.exit("Done")
