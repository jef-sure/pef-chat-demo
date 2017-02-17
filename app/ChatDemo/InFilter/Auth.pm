package ChatDemo::InFilter::Auth;
use PEF::Front::Config;

use strict;
use warnings;
use Scalar::Util qw(weaken);
use DateTime;
use DateTime::Format::Pg;
use ChatDemo::Local::Member;
use DBIx::Struct;
use Data::Dumper;
use Coro;

sub required {
	my ($auth, $context) = @_;
	my $member_auth
		= $context->{member_auth}
		|| ($context->{parent_context} ? $context->{parent_context}{member_auth} : undef)
		|| one_row(
		member_auth => {
			auth    => $auth,
			expires => {">", \"now()"}
		}
		);
	if ($member_auth) {
		my $td = DateTime->now();
		my $pt = DateTime::Format::Pg->parse_timestamptz($member_auth->expires);
		if (DateTime->compare($td, $pt) > 0) {
			ChatDemo::Local::Member::logout({auth => $auth}, $context);
			die {
				result => 'AUTH',
				answer => 'Authorization is required'
			};
		}
		my $ae = DateTime::Format::Pg->parse_interval(auth_expires());
		my $ne = $td + $ae;
		if ($ne->subtract_datetime_absolute($pt)->seconds > 5) {
			#don't update "expires" ofter than 5 sec
			$member_auth->expires(DateTime::Format::Pg->format_datetime($ne));
			$member_auth->update;
		}
		$context->{member_auth} ||= $member_auth;
		$context->{member} ||= $member_auth->Member;
		if ($context->{parent_context} && !$context->{parent_context}{member_auth}) {
			$context->{parent_context}{member_auth} = $context->{member_auth};
			$context->{parent_context}{member}      = $context->{member};
			weaken($context->{member_auth});
			weaken($context->{member});
		}
		print STDERR Dumper $@, $context if $@;
		return $auth;
	}
	die {
		result => 'AUTH',
		answer => 'Authorization is required'
	};
}

1;
