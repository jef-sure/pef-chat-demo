#!/home/anton/perl5/perlbrew/perls/perl-5.22.3/bin/perl

use FindBin;
use lib "$FindBin::Bin/../app";
use lib "/home/anton/git/pef-chat-demo/app";
use lib "/home/anton/git/pef-front-psgi-dist/lib";
use lib "/home/anton/git/dbix-struct-github/lib";

use ChatDemo::AppFrontConfig;
use PEF::Front::Config;
use PEF::Front::WebSocket 'queue_server';
use PEF::Front::Route;
use DBIx::Connector::Pool;
use DBIx::PgCoroAnyEvent;
use DBIx::Struct (error_class => 'DBIx::Struct::Error::Hash');
use strict;
use warnings;

my @pool_wait_queue;
$DBIx::Connector::Pool::Item::not_in_use_event = sub {
	if (my $wc = shift @pool_wait_queue) {
		$wc->ready;
	}
	$_[0]->used_now;
};
my $pool = DBIx::Connector::Pool->new(
	dsn        => "dbi:Pg:dbname=anton",
	user       => "anton",
	password   => '',
	initial    => 1,
	keep_alive => 60,
	max_size   => 15,
	tid_func   => sub {"$Coro::current" =~ /(0x[0-9a-f]+)/i; hex $1},
	wait_func  => sub {push @pool_wait_queue, $Coro::current; Coro::schedule;},
	attrs => {RootClass => 'DBIx::PgCoroAnyEvent'}
);
DBIx::Struct::set_connector_pool($pool);
DBIx::Struct::connect();
PEF::Front::Connector::db_connect($pool);
PEF::Front::Route::add_route(get '/' => '/appIndex',);
PEF::Front::Route->to_app();

