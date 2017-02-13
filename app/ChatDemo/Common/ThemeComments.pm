package ChatDemo::Common::ThemeComments;

use strict;
use warnings;

use DBIx::Struct qw(connector);

use base 'Exporter';

our @EXPORT = ('theme_comments');

sub theme_comments {
	my ($theme_id) = @_;
	return connector->run(
		sub {
			$_->selectall_arrayref(
				qq{
					with recursive comments(depth, path) as (
						select 1 depth, array[id] path, id, 
							parent_id, comment, member_id,
							comment_time
						from theme_comment
						where theme_id = ? and parent_id is null
						union all
						select depth + 1, path || array[c.id] path, c.id, 
							c.parent_id, c.comment, c.member_id,
							c.comment_time
						from theme_comment c, comments cs
						where c.parent_id = cs.id
					) select * from comments order by path, id
				}, {Slice => {}}, $theme_id
			);
		}
	);
}

1;
