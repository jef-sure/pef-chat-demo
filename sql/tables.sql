drop table model_version;
drop table member_auth;
drop table chat_message;
drop table chat_member;
drop table theme_comment;
drop table theme_member;
drop table chat;
drop table theme;
drop table member;
drop sequence sq_event_generator;

create table model_version (
  main         bigint not null 
);

insert into model_version values (0);

create table member (
  id           serial primary key,
  login        text not null unique,
  password     text not null,
  is_online    boolean not null default false,
  last_active  timestamp with time zone
);

create table member_auth (
  auth         text  not null unique primary key,
  member_id    integer not null references member(id) on delete cascade,
  expires      timestamp with time zone not null
);

create table chat (
  id        serial primary key,
  name      text   not null unique,
  owner_id  integer not null references member(id) on delete cascade,
  title     text,
  created   timestamp with time zone not null default now()
);

create table chat_member (
  member_id    integer not null references member(id) on delete cascade,
  chat_id      integer not null references chat(id) on delete cascade,
  unique (member_id, chat_id)
);

create table theme (
  id           serial primary key,
  post_time    timestamp with time zone not null default now(),
  subject      text not null,
  body         text not null,
  author_id    integer not null references member(id) on delete cascade
);

create table theme_member (
  member_id    integer not null references member(id) on delete cascade,
  theme_id     integer not null references theme(id) on delete cascade,
  unique (member_id, theme_id)
);

create table theme_comment (
  id           serial primary key,
  comment_time timestamp with time zone not null default now(),
  comment      text not null,
  theme_id     integer not null references theme(id) on delete cascade,
  member_id    integer not null references member(id) on delete cascade,
  parent_id    integer
);

alter table theme_comment 
  add constraint fk_theme_comment_parent_id 
  foreign key (parent_id) 
  references theme_comment(id) 
  on delete set null;

create table chat_message (
  id                serial primary key,
  message_time      timestamp with time zone not null default now(),
  message           text not null,
  member_id         integer not null references member(id) on delete cascade,
  chat_id           integer not null references chat(id) on delete cascade,
  theme_references  jsonb
);

create sequence sq_event_generator;
/*
CREATE OR REPLACE FUNCTION sortarray(int2[]) returns int2[] as '
  SELECT ARRAY(
      SELECT $1[i]
        FROM generate_series(array_lower($1, 1), array_upper($1, 1)) i
    ORDER BY 1
  )
' language sql;

  SELECT conrelid::regclass
         ,conname
    FROM pg_constraint
         JOIN pg_class ON (conrelid = pg_class.oid)
   WHERE contype = 'f'
         AND NOT EXISTS (
           SELECT 1
             FROM pg_index
            WHERE indrelid = conrelid
                  AND sortarray(conkey) = sortarray(indkey)
         )
ORDER BY 1;

drop function sortarray(int2[]);
*/

create index idx_chat_member_member_id_fkey on chat_member(member_id);
create index idx_chat_member_chat_id_fkey on chat_member(chat_id);
create index idx_theme_member_id_fkey on theme(author_id);
create index idx_theme_comment_theme_id_fkey on theme_comment(theme_id);
create index idx_theme_comment_member_id_fkey on theme_comment(member_id);
create index idx_theme_comment_parent_id_fkey on theme_comment(parent_id);
create index idx_chat_message_member_id_fkey on chat_message(member_id);
create index idx_chat_message_chat_id_fkey on chat_message(chat_id);
create index idx_member_auth_member_id_fkey on member_auth(member_id);
create index idx_chat_owner_id_fkey on chat(owner_id);
create index idx_theme_member_theme_id_fkey on theme_member(theme_id);
create index idx_theme_member_member_id_fkey on theme_member(member_id);

