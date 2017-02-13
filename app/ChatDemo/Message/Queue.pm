package ChatDemo::Message::Queue;

use strict;
use warnings;

use DBIx::Struct qw(connector);

use base 'Exporter';

our @EXPORT = qw{
	publish_to_model
	publish_to_client
	subscribe_to_queue
	unsubscribe_from_queue
};

sub subscribe_to_queue {
	my ($context, $queue, $id_message) = @_;
	return if not $context->{parent_context};
	$context = $context->{parent_context};
	return if not $context->{queue};
	$context->{queue}->subscribe($queue, $id_message);
}

sub unsubscribe_from_queue {
	my ($context, $queue) = @_;
	return if not $context->{parent_context};
	$context = $context->{parent_context};
	return if not $context->{queue};
	$context->{queue}->unsubscribe($queue);
}

sub publish_to_model {
	my ($context, $queue, $update_model, $message) = @_;
	return if not $context->{parent_context};
	$context = $context->{parent_context};
	return if not $context->{queue};
	my $id_message;
	connector->txn(
		sub {
			one_row(q{select * from model_version for update});
			$update_model->();
			$id_message = one_row(q{update model_version set main=nextval('sq_event_generator') returning main})->main;
		}
	);
	$message = $message->() if 'CODE' eq ref $message;
	$context->{queue}->publish($queue, $id_message, $message);
	$context->{current_model_version} = $id_message;
}

sub publish_to_client {
	my ($context, $queue, $message) = @_;
	return if not $context->{parent_context};
	$context = $context->{parent_context};
	return if not $context->{queue};
	$message = $message->() if 'CODE' eq ref $message;
	$context->{queue}->publish($queue, 0, $message);
}

1;
