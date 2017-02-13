export function initialStateStruct() {
  return {
    infoTray: [{
      key: "d",
      value: "15G"
    }, {
      key: "u",
      value: "85"
    }],
    teamName: "Demo Team",
    visual: {
      projects: {
        ordered: []
      },
      chats: {
        ordered: []
      },
      me: {},
      organization: {},
      schedule: {},
      panels: {
        header: true,
        nav: true,
        aside: false,
      }
    },
    projects: [{
      id: 1,
      title: "test project",
      chats: [1],
      is_archived: false
    }],
    chats: [{
      id: 1,
      title: "default",
      project_id: 1,
      messageLog: [{
        id: 1,
        messageTime: "2016-02-26 10:47:55+0100",
        content: "default - no messages yet",
        state: 1,
        from: "user",
        from_worker_id: 1,
      }],
      members: {
        1: {
          hasVoice: true,
          isModerator: true,
        },
        2: {
          hasVoice: true,
          isModerator: false,
        },
      }
    }, {
      id: 2,
      title: "popizdelka",
      messageLog: [{
        id: 2,
        messageTime: "2016-02-26 10:47:55+0100",
        content: "popizdelka - no messages yet",
        state: 2,
        from: "user",
        from_worker_id: 1,
      }],
      members: {
        1: {
          hasVoice: true,
          isModerator: true,
        },
        2: {
          hasVoice: true,
          isModerator: false,
        },
      }
    }, {
      id: 3,
      title: "tryndelka",
      messageLog: [{
        id: 3,
        messageTime: "2016-02-26 10:47:55+0100",
        content: "tryndelka - no messages yet",
        state: 3,
        from: "user",
        from_worker_id: 1,
      }],
      members: {
        1: {
          hasVoice: true,
          isModerator: true,
        },
        2: {
          hasVoice: true,
          isModerator: false,
        },
      }
    }, {
      id: 4,
      title: "niochem",
      messageLog: [{
        id: 4,
        messageTime: "2016-02-26 10:47:55+0100",
        content: "niochem tut no messages yet",
        state: 1,
        from: "user",
        from_worker_id: 1,
      }, {
        id: 5,
        messageTime: "2016-02-26 10:48:55+0100",
        content: "ya tozhe nichego ne skazal",
        state: 1,
        from: "anonym",
        from_worker_id: 2,
      }],
      members: {
        1: {
          hasVoice: true,
          isModerator: true,
        },
        2: {
          hasVoice: true,
          isModerator: false,
        },
      }
    }],
    me: {
      login: "user",
      fullName: "U Ser",
      currentLoginTime: "2016-02-26 10:47:55+0100",
      lastLoginTime: "2016-02-26 10:47:55+0100",
      worker_id: 1
    },
    organization: {
      departments: [{
        id: 1,
        name: "default"
      }],
      workers: {
        1: {
          id: 1,
          login: "user",
          fullName: "U Ser",
          departmentId: 1,
          contactInfo: [{
            isOpen: true,
            type: "email",
            value: "box@example.com"
          }, {
            isOpen: true,
            type: "skype",
            value: "skyper"
          }],
          personalInfo: {
            bithDate: "1980-02-26 10:47:55+0100",
            hobbies: "bicycle",
            about: "I love to ride my bicycle",
            resources: [{
              isOpen: true,
              type: "homepage",
              value: "http://localhost.lxc"
            }]
          }
        },
        2: {
          id: 2,
          login: "anonym",
          fullName: "A Non",
          departmentId: 1,
          contactInfo: [{
            isOpen: true,
            type: "email",
            value: "non@example.com"
          }, {
            isOpen: true,
            type: "skype",
            value: "nonskyper"
          }],
          personalInfo: {
            bithDate: "1980-02-26 10:47:55+0100",
            hobbies: "bicycle",
            about: "I love to ride my bicycle",
            resources: [{
              isOpen: true,
              type: "homepage",
              value: "http://localhost.lxc"
            }]
          }
        }
      }
    }
  };
}
