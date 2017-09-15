#!/bin/perl
#---------------------------------------------------
# Another fine product by Tod - tthomas@acme.com
# 5/22/2012
#
# Liteweight Perl proxy used in AJAX calls to avoid 
# cross site scripting errors.
####################################################

use LWP::UserAgent;

my($ua) = LWP::UserAgent->new;
my($URL) = URI->new('http://cbdl0lpap03:8080/solrA/select');

# Parse input (if any) from form and store it in the %form hash.
parseForm();

# Pass the parsed form content along with the URL to make the request
my($req) = $ua->post( $URL,\%form);

if ($req->is_success)
  {
#  Do nothing.
  }
else
  {
   printf(STDERR "solrProxy encountered fatal error:  %s\n", $req->status_line);
  }

my($raw) = $req->content;

print("Content-type:  application/json\n\n");
printf("%s\n",$raw);

exit;

#-------------------------------------
sub parseForm()
#-------------------------------------
   {
    # Been to first page and clicked on link
    # or tried to get here vi URL reference

    if($ENV{'REQUEST_METHOD'} eq "GET")

      {
       $buffer = $ENV{'QUERY_STRING'};
      }
    else
      {
       read(STDIN, $buffer, $ENV{'CONTENT_LENGTH'});
      }

    # Split pairs by the ampersand which divides variables
    @pairs = split(/&/, $buffer);

    # Create an array, indexed by the variable name, that contains all the values
    foreach $pair (@pairs)
       {
         # Each variable is structured "name1=vaule1", so split it on those lines
           ($name, $value) = split(/=/, $pair);
         # Decode the value (+ is a space and %xx in hex is an encoded character)
           $value =~ tr/+/ /;
           $value =~ s/%([a-fA-F0-9][a-fA-F0-9])/pack("C", hex($1))/eg;

         # Create an array indexed by names and put the value in
           $form{$name} = $value;
#print(STDERR "$name:$value<br>\n");
       }

    return;
   }
