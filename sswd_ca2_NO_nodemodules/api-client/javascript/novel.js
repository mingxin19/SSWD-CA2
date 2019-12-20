// JavaScript for the novel page
//

// CRUD operations 


// Parse JSON
// Create novel rows
// Display in web page
function displayNovel(novels) {

    // Use the Array map method to iterate through the array of novels (in json format)
    // Each novels will be formated as HTML table rowsand added to the array
    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
    // Finally the output array is inserted as the content into the <tbody id="novelRows"> element.
  
    const rows = novels.map(novel => {
      // returns a template string for each novel, values are inserted using ${ }
      // <tr> is a table row and <td> a table division represents a column
  
        let row = `<tr>
                <td>${novel.Novel_Id}</td>
                <td>${novel.Author_Id}</td>
                <td>${novel.Type_Id}</td>
                <td>${novel.Novel_Name}</td>
                <td>${novel.Novel_Description}</td>
                <td>${novel.Novel_Word_Count}</td>
                <td>${novel.Novel_Like}</td>`
      
        // If user logged in then show edit and delete buttons
        // To add - check user role        
        if (userLoggedIn() === true) {      
            row+= `<td><button class="btn btn-xs" onclick="likeNovel(${novel.Novel_Id})"><span class="oi oi-thumb-up"></span></button></td>` //<i class="glyphicon glyphicon-thumbs-up"></i>
        }
        else if(managerLoggedIn() === true){ //if user is a manager then the user can edit the novels
          row+= `<td><button class="btn btn-xs" data-toggle="modal" data-target="#NovelFormDialog" onclick="prepareNovelUpdate(${novel.Novel_Id})"><span class="oi oi-pencil"></span></button></td>
                  <td><button class="btn btn-xs" onclick="deleteNovel(${novel.Novel_Id})"><span class="oi oi-trash"></span></button></td>`
        }
        
        row+= '</tr>';

       return row;       
    });
  
    // Set the innerHTML of the novelRows root element = rows
    document.getElementById('novelRows').innerHTML = rows.join('');
  } // end function
  
  

  // load and display authors in a bootstrap list group
  function displayAuthors(authors) {
    //console.log(authors);
    //get all the authors name and list it at the side bar so user can use it to filter the novels
    const novels = authors.map(author => {
      return `<a href="#" class="list-group-item list-group-item-action" onclick="updateNovelsView(${author.Author_Id})">${author.Author_Name}</a>`;
    });
  
    // Add an All authors link at the start
    novels.unshift(`<a href="#" class="list-group-item list-group-item-action" onclick="loadNovels()">Show all</a>`);
  
    // Set the innerHTML of the authorList root element = rows
    document.getElementById('authorList').innerHTML = novels.join('');
  } // end function



  // load and display types in a bootstrap list group
  function displayTypes(types) {
    //console.log(types);
    const novels = types.map(type => {
      return `<a href="#" class="list-group-item list-group-item-action" onclick="updateNovelsTypeView(${type.Type_Id})">${type.Type_Name}</a>`;
    });
  
    // Add an All types link at the start
    novels.unshift(`<a href="#" class="list-group-item list-group-item-action" onclick="loadNovels()">Show all</a>`);
  
    // Set the innerHTML of the typeList root element = rows
    document.getElementById('typeList').innerHTML = novels.join('');
  } // end function



  
  

  
  // Get all authors, types and novels then display
  async function loadNovels() {
    try {
      const authors = await getDataAsync(`${BASE_URL}author`);
      displayAuthors(authors);
  
      const novels = await getDataAsync(`${BASE_URL}novel`);
      displayNovel(novels);

      const types = await getDataAsync(`${BASE_URL}type`);
      displayTypes(types);
  
    } // catch and log any errors
    catch (err) {
      console.log(err);
    }
  }




  

  
  // update novels list when Author is selected to show only novels from that Author
  async function updateNovelsView(id) {
    try {
      const novels = await getDataAsync(`${BASE_URL}novel/byAuthor/${id}`);
      displayNovel(novels);
  
    } // catch and log any errors
    catch (err) {
      console.log(err);
    }
  }

  // update novels list when type is selected to show only novels from that type
  async function updateNovelsTypeView(id) {
    try {
      const novels = await getDataAsync(`${BASE_URL}novel/byType/${id}`);
      displayNovel(novels);
  
    } // catch and log any errors
    catch (err) {
      console.log(err);
    }
  }
  
  // When a novel is selected for update/ editing, get it by id and fill out the form
  async function prepareNovelUpdate(id) {

    try {
        // Get broduct by id
        const novel = await getDataAsync(`${BASE_URL}novel/${id}`);
        // Fill out the form
        document.getElementById('novelId').value = novel.Novel_Id; // uses a hidden field - see the form
        document.getElementById('authorId').value = novel.Author_Id;
        document.getElementById('typeId').value = novel.Type_Id;
        document.getElementById('novelName').value = novel.Novel_Name;
        document.getElementById('novelDescription').value = novel.Novel_Description;
        document.getElementById('novelWordCount').value = novel.Novel_Word_Count;
        document.getElementById('like').value = novel.Novel_Like;
    } // catch and log any errors
    catch (err) {
    console.log(err);
    }
  }


  


  // Called when form submit button is clicked
  async function addOrUpdateNovel() {
  
    // url
    let url = `${BASE_URL}novel`
  
    // Get form fields
    const nId = Number(document.getElementById('novelId').value);
    const aId = Number(document.getElementById('authorId').value);
    const tId = Number(document.getElementById('typeId').value);
    const nName = document.getElementById('novelName').value;
    const pDesc = document.getElementById('novelDescription').value;
    const nwc = Number(document.getElementById('novelWordCount').value);
    const likes = Number(document.getElementById('like').value);

    // build request body
    const reqBody = JSON.stringify({
    Author_Id: aId,
    Type_Id: tId,
    Novel_Name: nName,
    Novel_Description: pDesc,
    Novel_Word_Count: nwc,
    Novel_Like: likes
    });

    // Try catch 
    try {
        let json = "";
        // determine if this is an insert (POST) or update (PUT)
        // update will include novel id
        if (nId > 0) {
            url+= `/${nId}`;
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

  // Delete novel by id using an HTTP DELETE request
  async function deleteNovel(id) {
      
    //to have a pop-up window asking if the user really want to delete a novel
    if (confirm("Are you sure?")) {
        // url
        const url = `${BASE_URL}novel/${id}`;
        
        // Try catch 
        try {
            const json = await deleteDataAsync(url);
            console.log("response: " + json);

            loadNovels();

        // catch and log any errors
        } catch (err) {
            console.log(err);
            return err;
        }
    }
  }


  


  // Like a novel by id using an HTTP PUT request
  async function likeNovel(id) {
        
    if (confirm("Are you sure?")) {
        // url
        const url = `${BASE_URL}novel/${id}`;

        //get the number of likes from the table with the list of novels, and add 1 to it
        const like = Number(document.getElementById('userLikeNovel').value);
        like = like + 1;
        
        // build request body
        const reqBody = JSON.stringify({
          Novel_Likes: like
        });

        // Try catch 
        try {
            const json = await postOrPutDataAsync(url, reqBody, 'PUT');
            console.log("response: " + json);

            loadNovels();

        // catch and log any errors
        } catch (err) {
            console.log(err);
            return err;
        }
    }
  }

 // Show button to add novel 
 function showAddNovelButton() {

  let addNovelButton= document.getElementById('addNovelButton');

  if (managerLoggedIn() === true) { //managerLoggedIn
    addNovelButton.style.display = 'block';
  }
  else {
    addNovelButton.style.display = 'none';
  }
 }

  

// show login or logout
showLoginLink();

// Load products
loadNovels();

showAddNovelButton();
