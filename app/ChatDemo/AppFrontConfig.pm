package ChatDemo::AppFrontConfig;
sub cfg_no_nls               {1}
sub cfg_no_multilang_support {1}
sub cfg_handle_static        {1}
sub cfg_log_level_info       {1}

our @EXPORT = qw{
	auth_expires
	last_chat_messages
};

sub auth_expires       {'30 days'}
sub last_chat_messages {20}

1;
