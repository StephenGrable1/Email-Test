/*
  TODOs:
  1. Grab all emails using fetchEmailsFromDatabase
  2. Implement and run the fetched emails through getFilteredEmails

  HINTs:
  1. Read documentation for "fetchEmailsFromDatabase" carefully
  2. Make use of "cursor" and "next" like paging results from APIs
*/

function render() {
  //this function will be called repeatedly until the response.next
  //value is null, which means we've reached the last page of results
  function runDBQueries(next = 0, emailsArr = []) {
    fetchEmailsFromDatabase(next, (response) => {
      let emails = response.result;
      let nextPage = response.next;

      if (response.next !== null) {
        //if we are not at the end of the paging results do the following
        for (var i = 0; i < emails.length; i++) {
          if (emailsArr.indexOf(emails[i]) === -1) {
            emailsArr.push(emails[i]);
          }
        }
        runDBQueries(nextPage, emailsArr)
      } else {
        //when we get here, we are at the end of the paging 
        //results and can continue to filter our emails
        getFilteredEmails(emailsArr);
      }
    })
  }
  runDBQueries()
}

/*
  Emails are of format { author: String, subject: String, body: String }

  args:
    allEmails: [Email], All emails fetched from fetchEmailsFromDatabase
    searchInputs: [Strings], Inputs to filter allEmails on

  return: [Email]
          All emails that have at least one mapped value
          that has any element of searchInputs as a substring
*/

function getFilteredEmails(allEmails = [], searchInputs = getSearchInputs()) {
  let filteredEmails = [];
  let props = ['author', 'subject', 'body'];

  //This portion of the code has a fairly large ~ O(n^2) complexity
  //However, I will continue since our inputs are rather small at the moment 
  for (var i = 0; i < allEmails.length; i++) {
    let email = allEmails[i];
    for (var j = 0; j < props.length; j++) {
      if (email[props[j]].includes(searchInputs[0]) || email[props[j]].includes(searchInputs[1]) || email[props[j]].includes(searchInputs[2])) {
        filteredEmails.push(email);
      }
    }
  }
  renderEmails(filteredEmails);

}

render();

//  ------------ Read But Do Not Make Changes Below This Line ------------

/*
  args:
    cursor: Integer, points to emails being fetched. Defaults to the beginning.

    callback: Function with args ({result, next})
      result: emails that were fetched from this call
      next: cursor pointing to the next page of results,
            or null if there are no more results.
*/
function fetchEmailsFromDatabase(cursor = 0, callback) {
  const emails = [
    {
      author: 'Bobby Bob',
      subject: 'Hey Friend!',
      body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
    },
    {
      author: 'Bobby Not-Bob',
      subject: 'Hey Friend!',
      body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
    },
    {
      author: 'Bobby Obo',
      subject: 'Hey Friendo!',
      body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
    },
    {
      author: 'Jenny Jane',
      subject: 'Let me know if you are planning...',
      body: `ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
    },
    {
      author: 'Jenny Janey',
      subject: 'Let Jenny know if you are planning...',
      body: `ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
    },
    {
      author: 'Some Guy',
      subject: 'Please DO NOT buy my product.',
      body: `My product is a scam. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat quis nostrud.`,
    },
    {
      author: 'Some Guy',
      subject: 'Please buy my product.',
      body: `My product is the best. For just $1,000 you could buy my product and make me somewhat richer. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat quis nostrud.`,
    },
  ];

  setTimeout(() => {
    const last = emails.length;
    const next = Math.min(cursor + _.random(1, 3), last);
    const fetchedEmails = _.slice(emails, cursor, next);

    callback({
      result: fetchedEmails,
      next: cursor === last ? null : next,
    });
  }, 100);
}

function renderEmails(emails) {
  const emailListHtml = _.map(emails, ({ author, subject, body }) => {
    return `<li class="email-item">
              <div class="meta-data">
                <span> <b>${author}</b>: ${subject} </span>
                <span> Today <b> 11:07 PM </b> </span>
              </div>
              ${body}
            </li>`;
  });

  $('#js-email-list').empty().append(emailListHtml);
}

function getSearchInputs() {
  return [
    'Bobby Bob',
    'Let me know if you are planning',
    'product is the best',
  ];
}
