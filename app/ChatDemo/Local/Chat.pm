package ChatDemo::Local::Chat;

use strict;
use warnings;

use PEF::Front::Config;
use DBIx::Struct qw(connector);
use ChatDemo::Message::Queue;
use ChatDemo::Common::MessageLog;
use DateTime;
use DateTime::Format::Pg;

sub make {
	my ($req, $context) = @_;
	my $chch = one_row(chat => {name => $req->{name}});
	return {
		result => 'DUPLICATE',
		answer => 'Chat with such a name already exists'
	} if $chch;
	my $chat;
	publish_to_model(
		$context,
		'chat-list',
		sub {
			$chat = new_row(
				'chat',
				name     => $req->{name},
				title    => $req->{title},
				owner_id => $context->{member}->id
			);
			subscribe_to_queue($context, 'chat::' . $chat->id, 0);
		},
		sub {
			return +{
				action => 'chat new',
				params => {
					id    => $chat->id,
					name  => $req->{name},
					title => $req->{title},
				}
			};
		}
	);
	return {
		result => "OK",
		id     => $chat->id
	};
}

sub delete {
	my ($req, $context) = @_;
	return {
		result => "NOTOWNER",
		answer => 'You have to be owner of this chat'
		}
		if $context->{chat}->owner_id != $context->{member}->id;
	publish_to_model(
		$context,
		'chat-list',
		sub {
			$context->{chat}->delete;
			delete $context->{chat};
		},
		{   action => 'chat delete',
			params => {id => $req->{id}}
		}
	);
	return {result => "OK"};
}

sub set_name {
	my ($req, $context) = @_;
	return {
		result => "NOTOWNER",
		answer => 'You have to be owner of this chat'
		}
		if $context->{chat}->owner_id != $context->{member}->id;
	publish_to_model(
		$context,
		'chat-list',
		sub {
			$context->{chat}->name($req->{name});
			$context->{chat}->update;
		},
		{   action => 'chat set name',
			params => {
				id   => $req->{id},
				name => $req->{name}
			}
		}
	);
	return {result => "OK"};
}

sub set_title {
	my ($req, $context) = @_;
	return {
		result => "NOTOWNER",
		answer => 'You have to be owner of this chat'
		}
		if $context->{chat}->owner_id != $context->{member}->id;
	publish_to_model(
		$context,
		'chat-list',
		sub {
			$context->{chat}->title($req->{title});
			$context->{chat}->update;
		},
		{   action => 'chat set title',
			params => {
				id    => $req->{id},
				title => $req->{title}
			}
		}
	);
	return {result => "OK"};
}

sub load_earlier {
	my ($req, $context) = @_;
	my $messages = connector->run(
		sub {
			$_->selectall_arrayref(
				qq{
					with t as (
						select * from chat_message
						where message_time < ? and chat_id = ?
						order by id desc 
						limit $req->{limit}
					)
					select * from t order by id
				}, {Slice => {}}, $req->{load_before}, $context->{chat}->id
			);
		}
	);
	return {
		result   => "OK",
		messages => $messages
	};
}

sub send_message {
	my ($req, $context) = @_;
	my $message;
	publish_to_model(
		$context,
		'chat::' . $context->{chat}->id,
		sub {
			$message = new_row(
				'chat_message',
				message   => $req->{message},
				member_id => $context->{member}->id,
				chat_id   => $context->{chat}->id,
			);
			$message->fetch;
		},
		sub {
			return +{
				action => 'chat new message',
				params => {
					id             => $message->id,
					message        => $req->{message},
					member_id      => $context->{member}->id,
					chat_id        => $context->{chat}->id,
					message_time   => $message->message_time,
					uniq_client_id => $req->{uniq_client_id},
				},
			};
		}
	);
	return {result => "OK"};
}

sub edit_message {
	my ($req, $context) = @_;
	return {
		result => "NOTOWNER",
		answer => 'You have to be author of this message'
		}
		if $context->{chat_message}->member_id != $context->{member}->id;
	publish_to_model(
		$context,
		'chat::' . $context->{chat_message}->chat_id,
		sub {
			$context->{chat_message}->message($req->{message});
			$context->{chat_message}->update;
		},
		+{  action => 'chat edit message',
			params => {
				id           => $req->{id},
				message      => $req->{message},
				member_id    => $context->{member}->id,
				chat_id      => $context->{chat_message}->chat_id,
				message_time => $context->{chat_message}->message_time,
				edit_time    => DateTime::Format::Pg->format_datetime(DateTime->now)
			},
		}
	);
	return {result => "OK"};
}

sub delete_message {
	my ($req, $context) = @_;
	return {
		result => "NOTOWNER",
		answer => 'You have to be author of this message'
		}
		if $context->{chat_message}->member_id != $context->{member}->id;
	publish_to_model(
		$context,
		'chat::' . $context->{chat_message}->chat_id,
		sub {
			$context->{chat_message}->delete;
		},
		+{  action => 'chat delete message',
			params => {
				id      => $req->{id},
				chat_id => $context->{chat_message}->chat_id,
			},
		}
	);
	return {result => "OK"};
}

sub join_member {
	my ($req, $context) = @_;
	my $chat_data;
	publish_to_model(
		$context,
		'chat-list',
		sub {
			eval {
#<<<
				new_row(
					'chat_member',
					chat_id   => $context->{chat}->id,
					member_id => $context->{member}->id
				)
#>>>
			};
			my $limit = last_chat_messages();
			$chat_data = $context->{chat}->data;
			$chat_data->{message_log} = chat_message_log($limit, $context->{chat}->id);
			$chat_data->{member_list} = all_rows(
				[chat_member => -columns => 'member_id'],
				{chat_id     => $context->{chat}->id},
				sub {
					$_->member_id;
				}
			);
			subscribe_to_queue($context, 'chat::' . $context->{chat}->id, 0);
			publish_to_client(
				$context,
				'member::' . $context->{member}->id,
				+{  action => 'chat data',
					params => $chat_data,
				}
			);
		},
		sub {
			+{  action => 'chat join member',
				params => {
					chat_id   => $req->{id},
					member_id => $context->{member}->id,
				}
			};
		}
	);
	return {result => "OK"};
}

sub leave_member {
	my ($req, $context) = @_;
	return {
		result => "OWNER",
		answer => "Owner can't live his own chat"
		}
		if $context->{chat}->owner_id == $context->{member}->id;
	publish_to_model(
		$context,
		'chat-list',
		sub {
			DBC::ChatMember->delete(
				{   chat_id   => $context->{chat}->id,
					member_id => $context->{member}->id
				}
			);
			unsubscribe_from_queue($context, 'chat::' . $context->{chat}->id);
		},
		+{  action => 'chat leave member',
			params => {
				chat_id   => $req->{id},
				member_id => $context->{member}->id,
			}
		}
	);
}

1;

