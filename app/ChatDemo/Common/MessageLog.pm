package ChatDemo::Common::MessageLog;

use strict;
use warnings;

use DBIx::Struct qw(connector);

use base 'Exporter';

our @EXPORT = ('chat_message_log');

sub chat_message_log {
	my ($limit, $chat_id) = @_;
	return connector->run(
		sub {
			$_->selectall_arrayref(
				qq{
					with t as (
						select * from chat_message
						where chat_id = ?
						order by id desc 
						limit $limit
					)
					select * from t order by id
				}, {Slice => {}}, $chat_id
			);
		}
	);
}

1;
