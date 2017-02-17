package ChatDemo::WebSocket::WAjax;
use strict;
use warnings;
use PEF::Front::Config;
use PEF::Front::Request;
use JSON;
use Coro;
use Scalar::Util qw'weaken';
use Data::Dumper;
use PEF::Front::Ajax;
use ChatDemo::Message::Queue;

sub on_message {
	my ($self, $message) = @_;
	eval {$message = decode_json $message};
	return if !$message;
	if ($message->{ajax}) {
		async {
			$self->process_ajax($message);
		};
		cede;
	}
}

sub on_open {
	my ($self) = @_;
	$self->{_context}{queue} = $self;
	weaken $self->{_context}{queue};
}

sub on_queue {
	my ($self, $queue, $id_message, $message) = @_;
	$self->send(encode_json $message);
}

sub process_ajax {
	my ($self, $message) = @_;
	my $env = {
		map {$_ => $self->{_request}->env->{$_}}
			qw(
			SERVER_NAME
			SERVER_PORT
			REMOTE_ADDR
			REMOTE_USER
			HTTP_COOKIE
			HTTP_HOST
			psgi.version
			psgi.errors
			psgi.url_scheme
			psgi.nonblocking
			psgi.streaming
			psgi.run_once
			psgi.multithread
			psgi.multiprocess
			psgix.input.buffered
			)
	};
	$env->{'psgi.input'}  = undef;
	$env->{'psgix.io'}    = undef;
	$env->{'SCRIPT_NAME'} = '';
	my $mrf = $message->{ajax}{method};
	$mrf =~ s/ ([[:lower:]])/\u$1/g;
	$mrf = ucfirst($mrf);
	my $path = '/ajax' . $mrf;
	$env->{'PATH_INFO'}   = $path;
	$env->{'REQUEST_URI'} = $path;
	my $request = PEF::Front::Request->new($env);
	cfg_log_level_info
		&& $request->logger->({level => "info", message => "serving ajax from websocket request: " . $request->path});
	if ($message->{ajax}{cookies}) {
		while (my ($cookie, $value) = each %{$message->{ajax}{cookies}}) {
			$request->cookies->{$cookie} = $value;
		}
	}
	if ($message->{ajax}{parameters}) {
		while (my ($p, $v) = each %{$message->{ajax}{parameters}}) {
			$request->param($p, $v);
		}
	}
	if (cfg_url_contains_lang) {
		$path = '/' . $self->{_context}{lang} . $path;
	}
	$request->path($path);
	my $context = PEF::Front::Route::prepare_context($request, 'ajax');
	$context->{parent_context} = $self->{_context};
	my $response = PEF::Front::Ajax::ajax($request, $context);
	delete $message->{ajax};
	$message->{ajax_response}{headers} = $response->[1];
	$message->{ajax_response}{body} = decode_json join "", @{$response->[2]};
	my $to_send = encode_json $message;
	print STDERR "encoded: $to_send";
	$self->send($to_send);
}

1;

