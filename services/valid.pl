#!/usr/bin/perl

use JSON::Schema;
use LWP::Simple qw[get];
use JSON;

open serviceh, "<service_manager.json";
my @service_spec = <serviceh>;
close serviceh;

open testh, "<interfaces.schema";
my @tests = <testh>;
close testh;

my %hash;
$hash{fig} = 12;
$hash{blin} = "tvoyu mat";

my $schema = get('http://json-schema.org/interfaces');
print $schema;
$schema = "@tests";

$validator = JSON::Schema->new($schema);
my $spec = from_json("@service_spec");
#print "@service_spec\n";
my $valid = $validator->validate($spec);
#print $spec->{errors}."\n";

#print $_."\n" foreach $spec->errors;
if($valid) {
    print "Validation ok!\n";
} else {
    print "valid is $valid\n";
    print "Validation failed\n";
    foreach my $e ($valid->errors){
	print "$e"."\n" unless /property errors is/ ;
	print "ЧО за говно? $e\n" if /property errors is/;
    }
}
