package ChatDemo::Local::Model;

use strict;
use warnings;

use PEF::Front::Config;
use DBIx::Struct qw(connector);
use ChatDemo::Message::Queue;
use ChatDemo::Common::MessageLog;
use ChatDemo::Common::ThemeComments;
use DateTime;
use DateTime::Format::Pg;

sub get_initial {
	my ($req, $context) = @_;
	my $response;
	my $limit = last_chat_messages();
	connector->txn(
		sub {
			$response->{version}   = one_row(q{select main from model_version for update})->main;
			$response->{members}   = all_rows('member', sub {$_->data(qw{login id})});
			$response->{me}        = {id => $context->{member}->id};
			$response->{chats}     = all_rows('chat', sub {$_->data});
			$response->{me}{chats} = [];
			for my $chat (@{$response->{chats}}) {
				$chat->{member_list}
					= all_rows([chat_member => -columns => 'member_id'], {chat_id => $chat->{id}}, sub {$_->member_id});
				if (grep {$context->{member}->id == $_} @{$chat->{member_list}}) {
					push @{$response->{me}{chats}}, $chat->{id};
					subscribe_to_queue($context, 'chat::' . $chat->{id}, 0);
					$chat->{message_log} = chat_message_log($limit, $chat->{id});
				} else {
					$chat->{message_log} = [];
				}
			}
			$response->{themes} = all_rows('theme', sub {$_->data});
			$response->{me}{themes} = [];
			for my $theme (@{$response->{themes}}) {
				$theme->{member_list}
					= all_rows([theme_member => -columns => 'member_id'], {theme_id => $theme->{id}}, sub {$_->member_id});
				if (grep {$context->{member}->id == $_} @{$theme->{member_list}}) {
					push @{$response->{me}{themes}}, $theme->{id};
					subscribe_to_queue($context, 'theme::' . $theme->{id}, 0);
					$theme->{comments} = theme_comments($theme->{id});
				}
			}
			subscribe_to_queue($context, 'member-list', 0);
			subscribe_to_queue($context, 'chat-list');
			subscribe_to_queue($context, 'theme-list');
			subscribe_to_queue($context, 'member::' . $context->{member}->id);
			$response->{result} = "OK";
		}
	);
	return $response;
}

1;

