/* ==========================================================================
   WTOP-10 WATCH PAGE: INFORMATION PAGES
   The Donate and About Us pages. Edit the text between the backticks.

   FORMATTING (inside body)
     ## Heading            ### Smaller heading      > Big callout line
     - List item           **bold**            [link text](https://...)
     Leave a blank line between paragraphs.
   Don't type a backtick (`) inside the text: it ends the section.

   Links on buttons: { label: "...", url: "https://..." } for another site,
   or { label: "...", page: "contact" } for one of these pages ("live" for
   the Live tab).
   ========================================================================== */

window.WTOP_PAGES = {
  /* Menu items after the show tabs. A group becomes a dropdown. */
  menu: [
    { page: "donate" },
    { label: "About Us", pages: ["about", "constitution", "contact"] }
  ],

  pages: {
    donate: {
      title: "Donate",
      banner: "assets/pages/studio.jpg",
      kicker: "Support WTOP-10",
      heading: "Keep student broadcasting alive",
      lead: "Help us keep producing student-led news, sports, entertainment and campus programming.",
      buttons: [
        { label: "Donate now", url: "https://alumni.oswego.edu/s/1552/bp18/home.aspx" }
      ],
      body: `
## Why your support matters

WTOP-10 is entirely student-run. Donations help us improve our broadcasts, upgrade equipment, train future broadcasters, and keep providing quality coverage of the SUNY Oswego community.

Every contribution, large or small, helps keep our station growing.
`,
      cards: [
        { title: "Broadcasting", items: ["Live productions", "Sports coverage", "Studio upgrades"] },
        { title: "Equipment", items: ["Cameras", "Microphones", "Tripods", "Lighting"] },
        { title: "Student development", items: ["Hands-on experience", "Training", "Workshops"] },
        { title: "Community coverage", items: ["Campus events", "Athletics", "Special programming"] }
      ]
    },

    about: {
      title: "Who We Are",
      banner: "assets/pages/team.jpg",
      kicker: "About WTOP-10",
      heading: "WTOP-10 and who we are",
      lead: "WTOP-10 is a 24/7, fully student-run television station at SUNY Oswego, where students get hands-on experience in news, sports, entertainment and live production.",
      body: `
## Learn, grow, and explore

Members take on real roles in front of and behind the camera: reporting, producing, directing, camera operation, editing, graphics and more. From covering campus news and Oswego sports to creating original entertainment, WTOP-10 gives students the chance to build career-changing skills while creating content for the community.

WTOP-10 is a place to find your interests, work with other students, and gain real-world experience that goes beyond the classroom. Whatever your experience level, we want you to get involved, try something new, and find your place at our station.

> WTOP-10: careers start here
`,
      buttons: [
        { label: "Watch live", page: "live" },
        { label: "Contact us", page: "contact" }
      ]
    },

    constitution: {
      title: "Constitution",
      kicker: "About WTOP-10",
      heading: "WTOP-10 Constitution",
      contents: true,
      body: `
## Preamble

This document is to govern WTOP-10 TV. WTOP-10 TV is the student-run television station funded by the Student Association of the State University of New York College at Oswego, hereafter referred to as SUNY Oswego. In all matters, the rules and regulations of the Student Association of SUNY Oswego shall supersede this constitution.

## Mission Statement

WTOP-10 TV’s mission shall be to provide hands-on experience and training in the field of broadcast television to the students of SUNY Oswego. In addition, the station shall provide the students of SUNY Oswego and the residents of the city of Oswego a service in the public’s interest, convenience, and necessity. These needs shall be served by informational and entertaining programs in compliance with all rules and regulations under the Student Association Code, the Federal Communications Commission (FCC), CATV, the laws of the state of New York, and the Constitution of the United States.

## Article I: Membership

**1.1** Membership in WTOP-10 TV is open to all students at SUNY Oswego paying the student activities fee set by the Student Association. This includes full and part-time undergraduate and graduate students. WTOP-10 TV shall not discriminate on the basis of race, sex, creed, religion, sexual orientation, or any other characteristic protected by law. Non-members are welcome to volunteer and participate in station activities at the discretion of the relevant Director.

**1.2** To be included on the station membership roster, a student must register with the station via Laker Life and participate in at least one WTOP-10 production or one meeting of a station board.

**1.3** Membership rosters shall be maintained by the People & Culture Director in coordination with the Faculty Advisor. Following each Fall and Spring semester, members who have not met the participation requirement in section 1.2 during that semester, as well as members who are graduating, shall be removed from the roster.

**1.4** Only students currently on the membership roster may vote in General Manager elections.

**1.5** Any student who ceases to be a registered student at SUNY Oswego shall be automatically withdrawn from WTOP-10 TV. A student may voluntarily withdraw at any time by notifying the People & Culture Director.

## Article II: Structure

**2.1** WTOP-10 TV shall be governed in a three-tier management structure.

**2.2** The first tier shall consist of the General Manager (GM), who is responsible for the overall direction, operations, and management of the station.

**2.3** The second tier shall consist of seven Directors, each leading a station board. The Directors and General Manager together form the Executive Board (E-Board). All Directors shall report directly to the General Manager. The seven Director positions are: News Director, Finance Director, Engineering & Operations Director, People & Culture Director, Production Director, Sports Director, and Creative Director.

**2.4** The third tier shall consist of board members serving under each Director. The composition of each board, including any sub-positions created within it, shall be established through the staffing plan process described in Article IV. All members of a board are expected to develop familiarity with all responsibilities of that board.

**2.5** Members may serve on multiple boards, provided doing so does not prevent another interested applicant from serving on any board.

## Article III: The Executive Board

**3.1** The Executive Board (E-Board) shall consist of the General Manager and the seven Directors. The E-Board is responsible for setting the direction of the station and making decisions on matters of station-wide concern.

**3.2** The E-Board shall meet at minimum biweekly during academic semesters, with at least one meeting held during the summer break. Additional meetings may be called as needed. Minutes of all meetings, including any decisions made, must be recorded and made available to all station members.

**3.3** All financial decisions must be approved by the E-Board.

**3.4** Unless otherwise specified in this constitution, E-Board decisions shall be approved by a simple majority vote. In the event of a 4–4 tie, the side on which the General Manager votes shall prevail.

**3.5** No person holding a stipended position may simultaneously hold another stipended position.

## Article IV: Elections and Appointments

**4.1** The term of all elected and appointed positions shall run from May 1 to April 30. All elections and selections shall be managed and overseen by the Faculty Advisor.

### General Manager Election

**4.2** The General Manager election shall be the first election to take place each year. Any student on the membership roster may declare candidacy.

**4.3** The election shall proceed in two rounds:
- (a) In the first round, all candidates shall be given equal time to address station members in a public meeting, after which a question-and-answer period shall be held for all candidates together. Each eligible voter may cast two votes. Voting shall remain open through the end of the meeting day.
- (b) The top two vote-getters shall advance to the final round. If two or more candidates are tied for second place, an immediate runoff vote shall be held among the tied candidates, with one vote per eligible member, to determine who advances.
- (c) In the final round, the two remaining candidates shall participate in a debate before a final vote is held, with one vote per eligible member. If only two candidates declared in the first round, the first round shall be skipped and the final round shall proceed as scheduled.
- (d) Graduating seniors may attend and participate in GM election proceedings but are not eligible to vote in any round.

**4.4** The General Manager election shall follow this timeline: the first-round meeting must be scheduled in the final week of March; the final-round meeting must be scheduled in the first week of April.

### Director Selection

**4.5** Director selections shall be completed within two weeks of the new General Manager’s election. Candidate interviews shall be conducted by the relevant selection subcommittee for each position. Votes for all Director positions shall be held at a single meeting attended by the incoming General Manager, all outgoing E-Board members, and the Faculty Advisor.

**4.6** For each Director position, the selection subcommittee shall consist of:
- (a) The incoming General Manager;
- (b) The outgoing General Manager; and
- (c) The outgoing Director of that position.

If any of these roles cannot be filled (e.g., the outgoing Director is running for another position, or a person holds multiple outgoing roles), the Faculty Advisor shall appoint a replacement from the outgoing E-Board.

**4.7** In the subcommittee vote, the incoming General Manager holds 2 votes; the outgoing General Manager and outgoing Director each hold 1 vote. In the event of a tie, the Faculty Advisor shall cast the deciding vote.

**4.8** Members are permitted and encouraged to apply for multiple Director positions. No member may hold more than one Director position. If two subcommittees select the same candidate for different positions, the full group in attendance shall determine which position is the better fit, and the subcommittee for the now-vacant position shall re-vote.

### Board Member Appointment

**4.9** Following Director selection, station members shall express their interest and apply to the boards on which they wish to serve, ranking their preferences. Each Director shall compile a staffing plan identifying which members will serve on their board and any sub-positions to be established within it, and shall present this plan to the E-Board for approval.

**4.10** If a board position is vacated outside of the normal application period, the Director may nominate a replacement, subject to E-Board approval.

**4.11** The target date for a fully constituted new E-Board shall be April 15.

**4.12** All members holding any position have the right to seek re-election or reappointment.

## Article V: Faculty Advisor

**5.1** The Faculty Advisor is a member of the SUNY Oswego faculty or staff designated to provide guidance and institutional continuity to WTOP-10 TV. The Faculty Advisor serves in an advisory capacity and does not hold a voting position on the E-Board except as specified in this constitution.

**5.2** The Faculty Advisor shall oversee and manage all election and selection processes as described in Article IV.

**5.3** The Faculty Advisor shall serve as a resource for the resolution of interpersonal conflicts within the station.

**5.4** The Faculty Advisor’s approval is required for any disciplinary consequence imposed on a member under the Code of Conduct, and for any impeachment or removal proceeding under Articles VII and VIII.

## Article VI: Boards and Departments

**6.1** WTOP-10 TV shall be organized into seven boards, each led by a Director and governed by this constitution. The responsibilities of each board are defined below. Sub-positions within each board may be established by the Director as part of the staffing plan process described in Article IV. Board meeting frequency and internal reporting structure shall be determined by each Director individually.

### 6.2 News Board

The News Board shall be responsible for all nightly news productions, including the recruitment and management of news producers, on-air news talent, news crew, and meteorologists.

### 6.3 Finance Board

The Finance Board shall be responsible for all station finances, including tracking revenue and expenses, managing the station budget, and overseeing advertising sales. The Finance Director shall fulfill the “Treasurer” role as defined by the Student Association.

### 6.4 Engineering & Operations Board

The Engineering & Operations Board shall be responsible for all technical and operational aspects of the station, including equipment maintenance, IT maintenance, on-call maintenance, technical training, website administration, and the programming of live streams.

### 6.5 People & Culture Board

The People & Culture Board shall be responsible for maintaining the station membership roster, diversity and inclusion initiatives, member recruitment and outreach, policy training (including Title IX), administering the Code of Conduct, and organizing station social events.

### 6.6 Production Board

The Production Board shall be responsible for all original productions, the management of original production crews, special event productions, and the station’s YouTube channel.

### 6.7 Sports Board

The Sports Board shall be responsible for all live sports productions, sports talent, live sports crew, and sports talent appearing on nightly news.

### 6.8 Creative Board

The Creative Board shall be responsible for advertising production, show promo production, video editing, graphics production, music management, social media accounts, and photography.

## Article VII: Disciplinary Procedures

### Removal from a Board

**7.1** A Director may propose the removal of a member from their board. Such removal requires approval by at least 6 of the 8 E-Board members. The affected member must be given an opportunity to address the E-Board before any vote on removal is held.

### Impeachment of a Director or General Manager

**7.2** Impeachment proceedings against a Director or the General Manager may be initiated and carried out as follows:
- (a) Proceedings may be initiated by a vote of at least 5 of the 7 remaining E-Board members, with the approval of the Faculty Advisor.
- (b) The person subject to impeachment must be given an opportunity to address the E-Board before the final vote is held.
- (c) Impeachment requires a vote of at least 5 of the 7 remaining E-Board members.

**7.3** If a Director is impeached or resigns, the standard Director selection process described in Article IV shall be used to fill the vacancy. The Faculty Advisor shall appoint members to fill any outgoing E-Board roles on the selection subcommittee that cannot otherwise be filled.

**7.4** If the General Manager is impeached or resigns, the E-Board shall select an interim General Manager from among the Directors. That Director’s vacated position shall then be filled through the standard selection process, with the Faculty Advisor appointing subcommittee members as needed.

### Removal from the Club

**7.5** Removal of a member from WTOP-10 TV may be proposed and carried out as follows:
- (a) Removal may be proposed by a vote of at least 6 of the 8 E-Board members, with the approval of the Faculty Advisor.
- (b) The affected member must be given an opportunity to address the E-Board before the final vote is held.
- (c) Removal requires a vote of at least 6 of the 8 E-Board members.

## Article VIII: Code of Conduct

**8.1** WTOP-10 TV shall maintain a Code of Conduct to which all members are subject.

**8.2** The Code of Conduct shall be created and amended by the E-Board. The procedure for amending the Code of Conduct shall be defined within the Code of Conduct itself.

**8.3** Any consequence imposed on a member for a violation of the Code of Conduct must be approved by the E-Board and the Faculty Advisor.

**8.4** Consequences under the Code of Conduct are separate from and do not include the disciplinary procedures described in Article VII, which have their own procedures.

## Article IX: Amendments

**9.1** This constitution may be amended by a vote of at least 6 of the 8 E-Board members.
`
    },

    contact: {
      title: "Contact",
      kicker: "About WTOP-10",
      heading: "Contact us",
      contact: {
        address: ["139 Campus Center", "SUNY Oswego", "Oswego, NY 13126"],
        email: "gm@wtop10.com",
        map: "https://maps.google.com/maps?q=Marano%20Campus%20Center%2C%20oswego%20ny%2013126&t=m&z=17&output=embed&iwloc=near",
        social: [
          { label: "Facebook", url: "https://www.facebook.com/wtop10tv/" },
          { label: "Instagram", url: "https://www.instagram.com/wtop10oswego/" },
          { label: "X", url: "https://x.com/wtop10" },
          { label: "YouTube", url: "https://www.youtube.com/@WTOP10TV" },
          { label: "LinkedIn", url: "https://www.linkedin.com/company/wtop-10-tv" }
        ]
      }
    }
  }
};
