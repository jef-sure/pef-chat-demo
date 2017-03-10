package ChatDemo::Local::Theme;

use strict;
use warnings;

use PEF::Front::Config;
use DBIx::Struct qw(connector);
use ChatDemo::Message::Queue;
use ChatDemo::Common::ThemeComments;
use DateTime;
use DateTime::Format::Pg;

sub make {
	my ($req, $context) = @_;
	my $theme = one_row(theme => {subject => $req->{subject}});
	return {
		result => 'DUPLICATE',
		answer => 'Theme with such a subject already exists'
	} if $theme;
	publish_to_model(
		$context,
		'theme-list',
		sub {
			$theme = new_row(
				'theme',
				subject   => $req->{subject},
				body      => $req->{body},
				author_id => $context->{member}->id
			);
			new_row(
				'theme_member',
				theme_id  => $theme->id,
				member_id => $context->{member}->id
			);
			subscribe_to_queue('theme::' . $theme->id, 0);
		},
		sub {
			return +{
				action => 'theme new',
				params => {
					id      => $theme->id,
					subject => $req->{subject},
					body    => $req->{body},
				}
			};
		}
	);
	return {
		result => "OK",
		id     => $theme->id
	};
}

sub delete {
	my ($req, $context) = @_;
	return {
		result => "NOTOWNER",
		answer => 'You have to be owner of this theme'
		}
		if $context->{theme}->author_id != $context->{member}->id;
	publish_to_model(
		$context,
		'theme-list',
		sub {
			unsubscribe_from_queue('theme::' . $context->{theme}->id);
			$context->{theme}->delete;
			delete $context->{theme};
		},
		+{  action => 'theme delete',
			params => {id => $req->{id}}
		}
	);
	return {result => "OK"};
}

sub set_subject {
	my ($req, $context) = @_;
	return {
		result => "NOTOWNER",
		answer => 'You have to be owner of this theme'
		}
		if $context->{theme}->author_id != $context->{member}->id;
	publish_to_model(
		$context,
		'theme-list',
		sub {
			$context->{theme}->subject($req->{subject});
			$context->{theme}->update;
		},
		+{  action => 'theme set subject',
			params => {
				id      => $req->{id},
				subject => $req->{subject}
			}
		}
	);
	return {result => "OK"};
}

sub amend_body {
	my ($req, $context) = @_;
	return {
		result => "NOTOWNER",
		answer => 'You have to be owner of this theme'
		}
		if $context->{theme}->author_id != $context->{member}->id;
	my $now = DateTime::Format::Pg->format_datetime(DateTime->now);
	$req->{body} = "\n\n\${amended $now}\n\n$req->{body}";
	publish_to_model(
		$context,
		'theme-list',
		sub {
			$context->{theme}->body([\"body || ?", $req->{body}]);
			$context->{theme}->update;
			$context->{theme}->fetch;
		},
		sub {
			return +{
				action => 'theme amend body',
				params => {
					id   => $req->{id},
					body => $context->{theme}->body
				}
			};
		}
	);
	return {result => "OK"};
}

sub add_comment {
	my ($req, $context) = @_;
	my $comment;
	my $comments_count;
	my $path;
	publish_to_model(
		$context,
		'theme::' . $context->{theme}->id,
		sub {
			$comment = new_row(
				'theme_comment',
				comment   => $req->{comment},
				member_id => $context->{member}->id,
				theme_id  => $req->{id},
				parent_id => $req->{parent_comment_id}
			);
			$comment->fetch;
			$comments_count = one_row([theme_comment => -columns => 'count(*)'], {id => $req->{id}})->count;
			$path = connector->run(
				sub {
					$_->selectrow_hashref(
						q{
							with recursive comment_path(path) as (
								select array[id] path, parent_id, id
								theme_comment comment
								where id = ?
								union all 
								select array[c.id] || path, c.parent_id, c.id
								from theme_comment c, comment_path cp 
								where cp.parent_id = c.id
							) 
							select * 
							from comment_path 
							where parent_id is null
						}, undef, $comment->id
					);
				}
			);
		},
		sub {
			return +{
				action => 'theme add comment',
				params => {
					id             => $comment->id,
					comment        => $req->{comment},
					member_id      => $context->{member}->id,
					theme_id       => $req->{id},
					comment_time   => $comment->comment_time,
					parent_id      => $req->{parent_comment_id},
					path           => $path->{path},
					comments_count => $comments_count,
				},
			};
		}
	);
	return {result => "OK"};
}

sub amend_comment {
	my ($req, $context) = @_;
	return {
		result => "NOTOWNER",
		answer => 'You have to be owner of this comment'
		}
		if $context->{theme_comment}->member_id != $context->{member}->id;
	publish_to_model(
		$context,
		'theme::' . $context->{theme_comment}->theme_id,
		sub {
			my $now = DateTime::Format::Pg->format_datetime(DateTime->now);
			$context->{theme_comment}->comment([\"comment || ?", "\n\n\${amend $now}\n\n"]);
			$context->{theme_comment}->update;
			$context->{theme_comment}->fetch;
		},
		sub {
			return +{
				action => 'theme amend comment',
				params => {
					id      => $req->{id},
					comment => $context->{theme_comment}->comment,
				},
			};
		}
	);
	return {result => "OK"};
}

sub delete_comment {
	my ($req, $context) = @_;
	return {
		result => "NOTOWNER",
		answer => 'You have to be owner of this comment'
		}
		if $context->{theme_comment}->member_id != $context->{member}->id;
	my $comment;
	publish_to_model(
		$context,
		'theme::' . $context->{theme_comment}->theme_id,
		sub {
			my $child_count = one_row([theme_comment => -columns => 'count(*)'], {parent_id => $req->{id}})->count;
			if ($child_count != 0) {
				my $now = DateTime::Format::Pg->format_datetime(DateTime->now);
				$comment = "\n\n\${deleted $now}\n\n";
				$context->{theme_comment}->comment($comment);
				$context->{theme_comment}->update;
			} else {
				$context->{theme_comment}->delete;
				$comment = undef;
			}
			delete $context->{theme_comment};
		},
		sub {
			return +{
				action => 'theme delete comment',
				params => {
					id      => $req->{id},
					comment => $comment,
				},
			};
		}
	);
	return {result => "OK"};
}

sub join {
	my ($req, $context) = @_;
	my $theme_comments;
	publish_to_model(
		$context,
		'chat-list',
		sub {
			new_row(
				'theme_member',
				theme_id  => $context->{theme}->id,
				member_id => $context->{member}->id
				)
				if not one_row(
				theme_member => {
					theme_id  => $context->{theme}->id,
					member_id => $context->{member}->id
				}
				);
			$theme_comments = {
				comments    => theme_comments($context->{theme}->id),
				member_list => all_rows(
					[theme_member => -columns => 'member_id'],
					{theme_id     => $context->{theme}->id},
					sub {
						$_->member_id;
					}
				)
			};
			subscribe_to_queue($context, 'theme::' . $context->{theme}->id, 0);
		},
		sub {
			return +{
				action => 'theme join',
				params => {
					chat_id   => $req->{id},
					member_id => $context->{member}->id,
					%$theme_comments
				}
			};
		}
	);
	return {result => "OK"};
}

sub leave {
	my ($req, $context) = @_;
	return {
		result => "OWNER",
		answer => "Owner can't live his own theme"
		}
		if $context->{theme}->author_id == $context->{member}->id;
	publish_to_model(
		$context,
		'theme-list',
		sub {
			DBC::ThemeMember->delete(
				{   theme_id  => $req->{id},
					member_id => $context->{member}->id
				}
			);
			unsubscribe_from_queue($context, 'theme::' . $req->{id});
		},
		+{  action => 'theme leave',
			params => {
				theme_id  => $req->{id},
				member_id => $context->{member}->id,
			}
		}
	);
	return {result => "OK"};
}

1;

