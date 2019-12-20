// Function to display login link if no user logged in
// When user is logged in show logout link
// Also adds an event listener or Bootstrap modal for login dialog
function showLoginLink() {
    const link = document.getElementById('loginLink')
  
    // Read session storage value (set during login) and set link
    if (userLoggedIn() === true) {
      link.innerHTML = 'Logout';
      link.removeAttribute('data-toggle');
      link.removeAttribute('data-target');
      link.addEventListener("click", logout);
    }
    else {
      link.innerHTML = 'Login';
      link.setAttribute('data-toggle', 'modal');
      link.setAttribute('data-target', '#LoginDialog');
      //link.addEventListener('click', login);
    }
  
  }
  
  // Login a user
  async function login() {
  
    // Login url
    const url = `${BASE_URL}login/auth`
  
    // Get form fields
    const email = document.getElementById('email').value;
    const pwd = document.getElementById('password').value;
    // build request body
    const reqBody = JSON.stringify({
      username: email,
      password: pwd
    });
  
    // Try catch 
    try {
      const json = await postOrPutDataAsync(url, reqBody, 'POST');
      console.log("response: " + json.user);
  
      // A successful login will return a user
      if (json.user != false) {
        // If a user then record in session storage
        sessionStorage.loggedIn = true;
        
        // force reload of page
        location.reload(true);
      }
  
      // catch and log any errors
    } catch (err) {
      console.log(err);
      return err;
    }
  
  }
  
  async function logout() {
  
    // logout url
    const url = `${BASE_URL}login/logout`
    // Try catch 
    try {
  
      // send request and via fetch
      const json = await getDataAsync(url);
      console.log("response: " + JSON.stringify(json));
  
      // forget user in session storage
      sessionStorage.loggedIn = false;
  
      // force reload of page
      location.reload(true);

  
      // catch and log any errors
      }catch (err) {
        console.log(err);
        return err;
      }
  }



  // Parse JSON
// Create user rows
// Display in web page
function displayUser(users) {

  // Use the Array map method to iterate through the array of users (in json format)
  // Each users will be formated as HTML table rowsand added to the array
  // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
  // Finally the output array is inserted as the content into the <tbody id="userRows"> element.

  const rows = users.map(user => {
    // returns a template string for each user, values are inserted using ${ }
    // <tr> is a table row and <td> a table division represents a column

      let row = `<tr>
              <td>${user.User_Id}</td>
              <td>${user.First_Name}</td>
              <td>${user.Last_Name}</td>
              <td>${user.Email}</td>
              <td>${user.Password}</td>
              <td>${user.Role}</td>`
    
      // If user logged in then show edit and delete buttons
      // To add - check user role        
      if(adminLoggedIn() === true){
        row+= `<td><button class="btn btn-xs" data-toggle="modal" data-target="#UserFormDialog" onclick="prepareUserUpdate(${user.User_Id})"><span class="oi oi-pencil"></span></button></td>
                <td><button class="btn btn-xs" onclick="deleteUser(${user.User_Id})"><span class="oi oi-trash"></span></button></td>`
      }

      row+= '</tr>';

     return row;       
  });

  // Set the innerHTML of the userRows root element = rows
  document.getElementById('userRows').innerHTML = rows.join('');
} // end function


  


  // load and display users in a bootstrap list group
  function displayAppUsers(users) {
    //console.log(users);
    const appUser = users.map(user => {
      return `<a href="#" class="list-group-item list-group-item-action" onclick="updateUsersView(${user.User_Id})">${user.Last_Name}</a>`;
    });
  
    // Add an All user link at the start
    appUser.unshift(`<a href="#" class="list-group-item list-group-item-action" onclick="loadUsers()">Show all Users</a>`);
  
    // Set the innerHTML of the novelRows root element = rows
    document.getElementById('appUsers').innerHTML = appUser.join('');
  } // end function



  // Get all users then display
  async function loadUsers() {
    try {
      const appuser = await getDataAsync(`${BASE_URL}user`);
      displayAppUsers(appuser);
  
    } // catch and log any errors
    catch (err) {
      console.log(err);
    }
  }


  // When a user is selected for update/ editing, get it by id and fill out the form
  async function prepareUserUpdate(id) {

    try {
        // Get user by id
        const user = await getDataAsync(`${BASE_URL}user/${id}`);
        // Fill out the form
        document.getElementById('userId').value = user.User_Id; // uses a hidden field - see the form
        document.getElementById('firstName').value = user.First_Name;
        document.getElementById('lastName').value = user.Last_Name;
        document.getElementById('email').value = user.Email;
        document.getElementById('password').value = user.Password; // uses a hidden field - see the form
        document.getElementById('role').value = user.Role;
    } // catch and log any errors
    catch (err) {
    console.log(err);
    }
  }



  // Delete user by id using an HTTP DELETE request
  async function deleteUser(id) {
        
    if (confirm("Are you sure?")) {
        // url
        const url = `${BASE_URL}user/${id}`;
        
        // Try catch 
        try {
            const json = await deleteDataAsync(url);
            console.log("response: " + json);

            loadUsers();

        // catch and log any errors
        } catch (err) {
            console.log(err);
            return err;
        }
    }
  }




  // Called when form submit button is clicked
  async function addOrUpdateUser() {
  
    // url
    let url = `${BASE_URL}user`
  
    // Get form fields
    const uId = document.getElementById('userId').value
    const firstname = document.getElementById('firstName').value;
    const lastname = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value
    const role = document.getElementById('role').value;


    // build request body
    const reqBody = JSON.stringify({
      User_Id: uId,
      First_Name: firstname,
      Last_Name: lastname,
      Email: email,
      Password: password,
      Role: role
    });

    // Try catch 
    try {
        let json = "";
        // determine if this is an insert (POST) or update (PUT)
        // update will include user id
        if (uId > 0) {
            url+= `/${uId}`;
            json = await postOrPutDataAsync(url, reqBody, 'PUT');
        }
        else {  
            json = await postOrPutDataAsync(url, reqBody, 'POST');
        }
      // Load products
      loadNovels();
      // catch and log any errors
    } catch (err) {
      console.log(err);
      return err;
    }
  }




  // Show user button
  function showAddUserButton() {

    let addUserButton= document.getElementById('addUserButton');
  
    if (adminLoggedIn() === true) {
      addUserButton.style.display = 'block';
    }
    else {
      addUserButton.style.display = 'none';
    }
   }












  //use to see is user(normal) login or not
  function userLoggedIn() {

    //if user login?
    if (sessionStorage.loggedIn == 'true' ) {
      return true;
    }
    else {
      return false;
    }
  }

  //use to see is user login or not and if the user that logged in is a manager or not
  function managerLoggedIn() {

    //if user login?
    if (sessionStorage.loggedIn == 'true' ) {
      //is user a manager?
      if(document.getElementById('role').value === 'manager'){
        return true;
      }else{
        return false;
      }
    }
    else {
      return false;
    }
  }


  //use to see is user login or not and if the user that logged in is an admin or not
  function adminLoggedIn() {

    //if user login?
    if (sessionStorage.loggedIn == 'true' ) {
      //is user a admin?
      if(document.getElementById('role').value === 'admin'){
        return true;
      }else{
        return false;
      }
    }
    else {
      return false;
    }
  }









// show login or logout
showLoginLink();

// Load user
loadUsers();

showAddUserButton();






