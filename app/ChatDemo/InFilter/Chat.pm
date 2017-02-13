package ChatDemo::InFilter::Chat;
use PEF::Front::Config;

use strict;
use warnings;
use DateTime;
use DateTime::Format::Pg;
use ChatDemo::Local::Member;
use DBIx::Struct;

sub id_to_chat {
	my ($id, $context) = @_;
	my $chat = one_row(chat => {id => $id});
	die {
		result => "NOCHAT",
		answer => 'Wrong chat id'
	} if not $chat;
	$context->{chat} = $chat;
	0 + $id;
}

sub id_to_message {
	my ($id, $context) = @_;
	my $chat_message = one_row(chat_message => {id => $id});
	die {
		result => "NOMESSAGE",
		answer => 'Wrong message id'
	} if not $chat_message;
	$context->{chat_message} = $chat_message;
	0 + $id;
}

1;
