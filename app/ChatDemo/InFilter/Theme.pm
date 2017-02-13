package ChatDemo::InFilter::Chat;
use PEF::Front::Config;

use strict;
use warnings;
use DateTime;
use DateTime::Format::Pg;
use ChatDemo::Local::Member;
use DBIx::Struct;

sub id_to_theme {
	my ($id, $context) = @_;
	my $theme = one_row(theme => {id => $id});
	die {
		result => "NOTHEME",
		answer => 'Wrong chat id'
	} if not $theme;
	$context->{theme} = $theme;
	0 + $id;
}

sub id_to_comment {
	my ($id, $context) = @_;
	my $theme_comment = one_row(theme_comment => {id => $id});
	die {
		result => "NOCOMMENT",
		answer => 'Wrong comment id'
	} if not $theme_comment;
	$context->{theme_comment} = $theme_comment;
	0 + $id;
}

sub id_to_comment_optional {
	my ($id, $context) = @_;
	return if not $id;
	my $theme_comment = one_row(theme_comment => {id => $id});
	return if not $theme_comment;
	$context->{theme_comment} = $theme_comment;
	0 + $id;
}

1;
