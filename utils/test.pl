#!/usr/bin/perl -I./

use JSON::Schema;
use LWP::Simple qw[get];
use JSON;



sub test1
{
    open testh, "<test1.schema";
    my @tests = <testh>;
    close testh;
    my $schema = "@tests";

    open jsonh, "<test1.json";
    my @json = <jsonh>;
    close jsonh;

#    print "@json\n";
    $validator = JSON::Schema->new($schema);
#print "@service_spec\n";
    my $valid = $validator->validate("@json");
#print $spec->{errors}."\n";
    
#print $_."\n" foreach $spec->errors;
    if($valid) {
	print "Validation ok!\n";
    } else {
	print "Validation failed\n";
	foreach my $e ($valid->errors){
	    print "$e"."\n" unless /property errors is/ ;
	    print "ЧО за говно? $e\n" if /property errors is/;
	}
    }
}

sub test_interfaces
{
    open serviceh, "<../services/service_manager.json";
    my @spec = <serviceh>;
    close serviceh;

    open spech, "<interfaces.schema";
    my @schema = <spech>;
    close spech;
#    my $schema = get('http://json-schema.org/interfaces');

    print $schema;
    $validator = JSON::Schema->new("@schema");
#    my $spec = from_json("@spec");
#print "@service_spec\n";
    my $valid = $validator->validate("@spec");
#print $spec->{errors}."\n";
    
#print $_."\n" foreach $spec->errors;
    if($valid) {
	print "Validation ok!\n";
    } else {
	print "Validation failed\n";
	foreach my $e ($valid->errors){
	    print "$e"."\n" unless /property errors is/ ;
	    print "ЧО за говно? $e\n" if /property errors is/;
	}
    }
}

#test1;

test_interfaces;
