package ChatDemo::Local::Member;

use strict;
use warnings;

use DBIx::Struct qw(connector hash_ref_slice);
use PEF::Front::Config;
use PEF::Front::Session;

sub login {
	my ($req, $context) = @_;
	my $member = one_row(member => {hash_ref_slice $req, qw(login password)});
	if ($member) {
		my $auth    = PEF::Front::Session::_secure_value();
		my $expires = auth_expires();
		new_row(
			'member_auth',
			member_id => $member->id,
			auth      => $auth,
			expires   => [\"now() + ?::interval", $expires]
		);
		return {
			result  => "OK",
			expires => $expires,
			auth    => $auth
		};
	}
	return {
		result => "PASSWORD",
		answer => 'Wrong password'
	};
}

sub logout {
	my ($req, $context) = @_;
	DBC::MemberAuth->delete({auth => $req->{auth}});
	delete $context->{member};
	delete $context->{member_auth};
	if ($context->{parent_context}) {
		delete $context->{parent_context}{member_auth};
		delete $context->{parent_context}{member};
	}
	return {result => "OK"};
}

sub info {
	my ($req, $context) = @_;
	return {
		result => "OK",
		login  => $context->{member}->login,
	};
}

my @pwdic = ('a' .. 'z', 'A' .. 'Z');

sub register {
	my ($req, $context) = @_;
	my $member = one_row(member => {login => $req->{login}});
	if ($member) {
		return {
			result => "DUPLICATE",
			answer => 'This login is already registered'
		};
	}
	my $pw = join "", map {$pwdic[rand @pwdic]} 0 .. 5;
	publish_to_model(
		$context,
		'member-list',
		sub {
			$member = new_row(
				'member',
				login    => $req->{login},
				password => $pw
			);
		},
		sub {
			return +{
				action => 'member new',
				params => {
					id    => $member->id,
					login => $req->{login},
				},
			};
		}
	);
	return {
		result   => "OK",
		password => $pw,
	};
}

sub set_password {
	my ($req, $context) = @_;
	$context->{member}->password($req->{password});
	$context->{member}->update;
	return {result => "OK"};
}

1;

